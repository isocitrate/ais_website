"use client";
import { useEffect, useRef } from "react";
import styles from "./NeuralBackground.module.css";

/*
  Alternative hero background: a loss landscape drawn as contour lines
  (isolines), with a gradient-descent path stepping downhill to the minimum.
  A new landscape is generated on every page load: the global minimum always
  lands in the open area top right (above the hero's right column, clear of the
  menu, logo and text), with one or two shallow local minima near the way
  there. On load a maroon ball runs momentum gradient descent once and settles;
  about 30% of loads it gets stuck in a local minimum (the landscape is picked
  so that this happens). Clicking an empty part of the hero drops a new ball.
  The animation loop only runs while a ball is rolling. Faded behind content (CSS).
*/

// A random landscape, in resolution-independent terms: x as a fraction of the
// width, y and sizes in units of the height (so wells stay round when stretched).
const OPEN_AREA = { x0: 0.5, x1: 0.98, y0: 0.2, y1: 0.5 }; // where the ball may roll
function randomLandscape() {
  const rnd = (a, b) => a + Math.random() * (b - a);
  const goal = { fx: rnd(0.82, 0.9), y: rnd(0.33, 0.4), depth: 1, size: 0.05 };
  const start = { fx: rnd(0.6, 0.7), fy: rnd(0.27, 0.35) };
  const traps = [];
  for (let k = 0, n = Math.random() < 0.5 ? 1 : 2; k < n; k++) {
    // Somewhere 30–70% of the way from the start to the goal, slightly off the line.
    const t = rnd(0.3, 0.7);
    traps.push({
      fx: start.fx + (goal.fx - start.fx) * t + rnd(-0.015, 0.015),
      y: start.fy + (goal.y - start.fy) * t + rnd(-0.03, 0.03),
      depth: rnd(0.18, 0.32),
      size: 0.01,
    });
  }
  const bumps = [];
  for (let k = 0, n = Math.random() < 0.5 ? 1 : 2; k < n; k++) {
    const b = { fx: rnd(0.55, 0.95), y: rnd(0.1, 0.5), height: rnd(0.15, 0.27), size: rnd(0.012, 0.024) };
    if (Math.abs(b.fx - goal.fx) > 0.06 || Math.abs(b.y - goal.y) > 0.12) bumps.push(b); // not on the goal
  }
  return { goal, traps, bumps, start };
}

// Loss surface over (X, Y) in height units; `r` = width / height.
function makeLoss(r, land) {
  const wells = [land.goal, ...land.traps].map((w) => ({ x: w.fx * r, y: w.y, depth: w.depth, size: w.size }));
  const bumps = land.bumps.map((b) => ({ x: b.fx * r, y: b.y, height: b.height, size: b.size }));
  const g = wells[0];
  return (X, Y) => {
    // Gentle bowl toward the global minimum so every path eventually gets there.
    let v = 0.35 * (((X - g.x) / r) ** 2 + (Y - g.y) ** 2);
    for (const w of wells) v -= w.depth * Math.exp(-((X - w.x) ** 2 + (Y - w.y) ** 2) / w.size);
    for (const b of bumps) v += b.height * Math.exp(-((X - b.x) ** 2 + (Y - b.y) ** 2) / b.size);
    return v;
  };
}

// Marching squares: line segments where the sampled field crosses `level`.
function contourSegments(field, cols, rows, cell, level) {
  const segs = [];
  const lerp = (a, b) => (level - a) / (b - a);
  for (let j = 0; j < rows - 1; j++) {
    for (let i = 0; i < cols - 1; i++) {
      const tl = field[j * cols + i];
      const tr = field[j * cols + i + 1];
      const br = field[(j + 1) * cols + i + 1];
      const bl = field[(j + 1) * cols + i];
      const idx = (tl > level ? 8 : 0) | (tr > level ? 4 : 0) | (br > level ? 2 : 0) | (bl > level ? 1 : 0);
      if (idx === 0 || idx === 15) continue;
      const x = i * cell;
      const y = j * cell;
      const top = [x + lerp(tl, tr) * cell, y];
      const right = [x + cell, y + lerp(tr, br) * cell];
      const bottom = [x + lerp(bl, br) * cell, y + cell];
      const left = [x, y + lerp(tl, bl) * cell];
      const table = {
        1: [[left, bottom]], 2: [[bottom, right]], 3: [[left, right]], 4: [[top, right]],
        5: [[left, top], [bottom, right]], 6: [[top, bottom]], 7: [[left, top]], 8: [[left, top]],
        9: [[top, bottom]], 10: [[left, bottom], [top, right]], 11: [[top, right]], 12: [[left, right]],
        13: [[bottom, right]], 14: [[left, bottom]],
      };
      for (const s of table[idx]) segs.push(s);
    }
  }
  return segs;
}

// Props:
// - interactive={false}: contours only (inner-page header bands, the maroon
//   block) — no ball, no clicking, no animation; drawn once (and on resize /
//   theme change).
// - outcome="stuck": the on-load ball always ends in a local minimum (used on
//   the "coming soon" page).
// - tone="maroon": white tone-on-tone lines on a transparent canvas, for use on
//   the maroon "Get involved" block. No tint.
// - fade="left": fade out toward the left (where text sits) instead of downward.
export default function GradientDescentBackground({ interactive = true, outcome = "random", tone = "paper", fade = "down" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // On narrow screens the hero has no open space, so there's no ball on load
    // (contours only) — but a tap still drops one.
    const narrow = () => width < 700;
    let showBall = false;
    let start = null; // last drop point, as fractions of width/height
    let width = 0;
    let height = 0;
    let contours = null; // offscreen canvas with the static contour map
    let loss = null;
    let land = null; // this visit's landscape (kept across resizes / theme changes)
    let path = [];
    // Playback is by distance along the path, not by optimizer step: steep parts
    // take big steps (would flash past) and flat parts tiny ones (would crawl).
    let cum = []; // cumulative px distance to each path point
    let elapsed = 0;
    let duration = 0;
    let progress = 0; // distance travelled, px
    let raf = 0;
    let last = 0;
    let resizeTimer = 0;

    const palette = () => {
      const dark = document.documentElement.dataset.theme === "dark";
      const maroon = getComputedStyle(document.documentElement).getPropertyValue("--maroon-rgb").trim() || "139,23,36";
      if (tone === "maroon") return { background: null, line: [255, 255, 255], alpha: 0.13, tint: 0, maroon };
      return {
        background: dark ? "#171412" : "#fbfaf8",
        line: dark ? [174, 168, 160] : [120, 114, 106],
        alpha: dark ? 0.32 : 0.3,
        tint: 1, // lines take on the maroon near the minimum (depth shading)
        maroon,
      };
    };
    let colors = palette();

    function descend(fx, fy) {
      // Momentum gradient descent from (fx, fy), given as fractions of width/height.
      const r = width / height;
      let X = fx * r;
      let Y = fy;
      let vx = 0;
      let vy = 0;
      const h = 1e-3;
      const pts = [[X, Y]];
      for (let k = 0; k < 900; k++) {
        const gx = (loss(X + h, Y) - loss(X - h, Y)) / (2 * h);
        const gy = (loss(X, Y + h) - loss(X, Y - h)) / (2 * h);
        vx = 0.82 * vx - 0.0012 * gx;
        vy = 0.82 * vy - 0.0012 * gy;
        X += vx;
        Y += vy;
        pts.push([X, Y]);
        if (Math.hypot(vx, vy) < 2e-5 && Math.hypot(gx, gy) < 0.02) break;
      }
      return pts.map(([px, py]) => [px * height, py * height]);
    }

    // Pick this visit's landscape. Decide up front whether the on-load ball should
    // get stuck (~30%), then sample landscapes until one does exactly that while
    // staying inside the open area. Each try simulates one roll (< 1 ms).
    function chooseLandscape() {
      const wantStuck = outcome === "stuck" || Math.random() < 0.3;
      const r = width / height;
      let fallback = null;
      for (let tries = 0; tries < 40; tries++) {
        const candidate = randomLandscape();
        loss = makeLoss(r, candidate);
        const pts = descend(candidate.start.fx, candidate.start.fy);
        const inside = pts.every(
          ([px, py]) =>
            px / width >= OPEN_AREA.x0 && px / width <= OPEN_AREA.x1 && py / height >= OPEN_AREA.y0 && py / height <= OPEN_AREA.y1
        );
        if (!inside) continue;
        const [ex, ey] = pts[pts.length - 1];
        const stuck = Math.hypot(ex / height - candidate.goal.fx * r, ey / height - candidate.goal.y) > 0.04;
        fallback = fallback || candidate;
        if (stuck === wantStuck) return candidate;
      }
      return fallback || randomLandscape();
    }

    function build() {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!land) land = interactive ? chooseLandscape() : randomLandscape();
      loss = makeLoss(width / height, land);

      // Sample the loss on a grid and trace isolines once into an offscreen canvas.
      const cell = 10;
      const cols = Math.ceil(width / cell) + 1;
      const rows = Math.ceil(height / cell) + 1;
      const field = new Float32Array(cols * rows);
      let min = Infinity;
      let max = -Infinity;
      for (let j = 0; j < rows; j++)
        for (let i = 0; i < cols; i++) {
          const v = loss((i * cell) / height, (j * cell) / height);
          field[j * cols + i] = v;
          if (v < min) min = v;
          if (v > max) max = v;
        }
      contours = document.createElement("canvas");
      contours.width = canvas.width;
      contours.height = canvas.height;
      const c = contours.getContext("2d");
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.lineWidth = 1;
      const levels = 22;
      const maroonRgb = colors.maroon.split(",").map(Number);
      for (let k = 1; k < levels; k++) {
        // Denser near the bottom of the landscape (squared spacing).
        const level = min + (max - min) * (k / levels) ** 2;
        // Depth shading: the lowest rings (near the minimum) shift toward maroon.
        const depth = colors.tint * (1 - k / levels) ** 2;
        const rgb = colors.line.map((v, i) => Math.round(v + (maroonRgb[i] - v) * depth * 0.85));
        c.strokeStyle = `rgba(${rgb.join(",")},${colors.alpha + depth * 0.2})`;
        c.beginPath();
        for (const [a, b] of contourSegments(field, cols, rows, cell, level)) {
          c.moveTo(a[0], a[1]);
          c.lineTo(b[0], b[1]);
        }
        c.stroke();
      }

      // After a resize, recompute the same drop at the new size and carry on from
      // the same fraction of the roll (settled stays settled).
      if (start) {
        const fraction = duration ? elapsed / duration : 1;
        path = descend(start.fx, start.fy);
        measure();
        elapsed = fraction * duration;
        progress = ease(Math.min(1, fraction)) * cum[cum.length - 1];
      }
    }

    // Ease in-out: the ball picks up speed, cruises, then settles gently.
    const ease = (k) => (k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2);

    function measure() {
      cum = [0];
      for (let i = 1; i < path.length; i++)
        cum.push(cum[i - 1] + Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]));
      const total = cum[cum.length - 1];
      // ~0.25 px/ms on average, but never shorter than 3 s or longer than 5 s.
      duration = Math.min(5000, Math.max(3000, total / 0.25));
    }

    function drop(fx, fy) {
      start = { fx, fy };
      path = descend(fx, fy);
      measure();
      elapsed = reducedMotion ? duration : 0;
      progress = reducedMotion ? cum[cum.length - 1] : 0;
      showBall = true;
      draw();
      if (!reducedMotion && !raf) {
        last = 0;
        raf = window.requestAnimationFrame(frame);
      }
    }

    function draw() {
      if (colors.background) {
        ctx.fillStyle = colors.background;
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
      if (contours) ctx.drawImage(contours, 0, 0, width, height);
      if (path.length < 2 || !showBall) return;

      // Ball position: interpolate to the point `progress` px along the path.
      let end = 1;
      while (end < cum.length - 1 && cum[end] < progress) end++;
      const seg = cum[end] - cum[end - 1] || 1;
      const f = Math.min(1, Math.max(0, (progress - cum[end - 1]) / seg));
      const bx = path[end - 1][0] + (path[end][0] - path[end - 1][0]) * f;
      const by = path[end - 1][1] + (path[end][1] - path[end - 1][1]) * f;

      // Trail: fades out over the last ~450 px behind the ball.
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      for (let i = 1; i < end; i++) {
        const behind = progress - cum[i];
        const alpha = reducedMotion ? 0.7 : Math.max(0, 0.75 * (1 - behind / 450));
        if (alpha <= 0) continue;
        ctx.strokeStyle = `rgba(${colors.maroon},${alpha})`;
        ctx.beginPath();
        ctx.moveTo(path[i - 1][0], path[i - 1][1]);
        ctx.lineTo(path[i][0], path[i][1]);
        ctx.stroke();
      }
      if (end >= 1) {
        ctx.strokeStyle = `rgba(${colors.maroon},0.75)`;
        ctx.beginPath();
        ctx.moveTo(path[end - 1][0], path[end - 1][1]);
        ctx.lineTo(bx, by);
        ctx.stroke();
      }
      ctx.fillStyle = `rgb(${colors.maroon})`;
      ctx.beginPath();
      ctx.arc(bx, by, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    function frame(now) {
      const dt = Math.min(50, now - (last || now));
      last = now;
      elapsed = Math.min(duration, elapsed + dt);
      progress = ease(elapsed / duration) * cum[cum.length - 1];
      draw();
      // Stop once the ball has settled; nothing animates until the next drop.
      raf = elapsed < duration ? window.requestAnimationFrame(frame) : 0;
    }

    // Click on an empty part of the hero (not a link/button) to drop a ball there.
    const host = canvas.parentElement;
    // Only where the landscape is visible: the canvas fades out by 80% of its
    // height (CSS mask), and the canvas starts 2.5% above the hero and is 105% tall.
    const CLICK_LIMIT = 0.8 * 1.05 - 0.025 - 0.03; // fraction of the hero's height, with a small margin
    const inReach = (event) => {
      const r = host.getBoundingClientRect();
      return (event.clientY - r.top) / r.height <= CLICK_LIMIT;
    };
    function onPointerMove(event) {
      host.classList.toggle(styles.outOfReach, !inReach(event));
    }
    function onClick(event) {
      if (event.target.closest("a, button, input, select, textarea, summary, label")) return;
      if (!inReach(event)) return;
      if (window.getSelection && String(window.getSelection())) return; // was selecting text
      const rect = canvas.getBoundingClientRect(); // canvas is drawn slightly larger than the hero
      const x = ((event.clientX - rect.left) / rect.width) * width;
      const y = ((event.clientY - rect.top) / rect.height) * height;
      drop(x / width, y / height);
    }

    function onResize() {
      // ResizeObserver also fires once when it starts observing; ignore non-changes.
      const rect = canvas.parentElement.getBoundingClientRect();
      if (Math.abs(rect.width - width) < 1 && Math.abs(rect.height - height) < 1) return;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        build();
        draw();
      }, 150);
    }

    build();
    draw();
    if (interactive) {
      // One descent on load (desktop only), from this landscape's start point.
      if (!narrow()) drop(land.start.fx, land.start.fy);
      host.addEventListener("click", onClick);
      host.classList.add(styles.droppable);
      host.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(canvas.parentElement);
    const themeObserver = new MutationObserver(() => {
      colors = palette();
      build();
      draw();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    return () => {
      window.cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      host.removeEventListener("click", onClick);
      host.classList.remove(styles.droppable, styles.outOfReach);
      host.removeEventListener("pointermove", onPointerMove);
      resizeObserver.disconnect();
      themeObserver.disconnect();
    };
  }, [interactive, outcome, tone]);

  return (
    <canvas
      ref={canvasRef}
      className={`${styles.canvas} ${fade === "left" ? styles.fadeLeft : styles.fade}`}
      aria-hidden="true"
    />
  );
}
