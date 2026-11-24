"use client";
import { useEffect, useRef } from "react";
import styles from "./NeuralBackground.module.css";

export default function NeuralBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let nodes = [];
    let edges = [];
    let pulses = [];
    let raf = 0;
    let last = 0;
    let ambientTimer = 0;
    let resizeTimer = 0;

    const mouse = { x: 0, y: 0, sx: 0, sy: 0, active: false, strength: 0 };

    function rgba(color, alpha) {
      return `rgba(${color.join(",")},${alpha})`;
    }

    function mix(a, b, amount) {
      return a.map((value, index) => value + (b[index] - value) * amount);
    }

    function readPalette() {
      const styles = getComputedStyle(document.documentElement);
      const dark = document.documentElement.dataset.theme === "dark";
      const ink = styles.getPropertyValue("--ink-rgb").trim() || (dark ? "236,231,223" : "26,24,21");
      const maroon = styles.getPropertyValue("--maroon-rgb").trim() || (dark ? "208,106,99" : "139,23,36");
      return {
        background: dark ? "#171412" : "#fbfaf8",
        idle: ink.split(",").map(Number),
        active: maroon.split(",").map(Number),
        grid: dark ? "#211d19" : "#f2f0ec",
      };
    }

    let palette = readPalette();

    function build() {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      nodes = [];
      edges = [];
      pulses = [];
      const layerCount = Math.max(3, Math.round(width / 210) + 1);
      const gapX = width / (layerCount - 1);
      const base = Math.max(2, Math.round(height / 150));
      const layers = [];

      for (let layerIndex = 0; layerIndex < layerCount; layerIndex++) {
        const count = Math.max(2, base + Math.round((Math.random() * 2 - 1) * base * 0.25));
        const gapY = height / count;
        const layer = [];

        for (let i = 0; i < count; i++) {
          const node = {
            bx: layerIndex * gapX + (Math.random() - 0.5) * gapX * 0.35,
            by: (i + 0.5) * gapY + (Math.random() - 0.5) * gapY * 0.5,
            x: 0,
            y: 0,
            phase: Math.random() * Math.PI * 2,
            speed: 0.6 + Math.random() * 0.8,
            act: 0,
            prox: 0,
            cool: 0,
            out: [],
          };
          node.x = node.bx;
          node.y = node.by;
          layer.push(node);
          nodes.push(node);
        }
        layers.push(layer);
      }

      for (let layerIndex = 0; layerIndex < layers.length - 1; layerIndex++) {
        for (const node of layers[layerIndex]) {
          const nearest = layers[layerIndex + 1]
            .slice()
            .sort((a, b) => Math.abs(a.by - node.by) - Math.abs(b.by - node.by));
          const connectionCount = Math.min(nearest.length, 2 + (Math.random() < 0.3 ? 1 : 0));
          for (let i = 0; i < connectionCount; i++) {
            const edge = { a: node, b: nearest[i], w: 0.75 + Math.random() * 0.25, act: 0 };
            node.out.push(edge);
            edges.push(edge);
          }
        }
      }
    }

    function fire(node, strength) {
      node.cool = 500 + Math.random() * 700;
      for (const edge of node.out) {
        if (pulses.length >= 260) break;
        pulses.push({
          edge,
          t: 0,
          strength: strength * edge.w,
          length: Math.max(1, Math.hypot(edge.b.bx - edge.a.bx, edge.b.by - edge.a.by)),
        });
      }
    }

    function draw() {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = palette.background;
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = palette.grid;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = (width % 112) / 2; x < width; x += 112) {
        ctx.moveTo(Math.round(x) + 0.5, 0);
        ctx.lineTo(Math.round(x) + 0.5, height);
      }
      for (let y = (height % 112) / 2; y < height; y += 112) {
        ctx.moveTo(0, Math.round(y) + 0.5);
        ctx.lineTo(width, Math.round(y) + 0.5);
      }
      ctx.stroke();

      ctx.lineWidth = 1;
      ctx.beginPath();
      const litEdges = [];
      for (const edge of edges) {
        const activation = Math.max(edge.act, (edge.a.prox + edge.b.prox) * 0.5);
        if (activation < 0.02) {
          ctx.moveTo(edge.a.x, edge.a.y);
          ctx.lineTo(edge.b.x, edge.b.y);
        } else {
          litEdges.push(edge, activation);
        }
      }
      ctx.strokeStyle = rgba(palette.idle, 0.22);
      ctx.stroke();

      for (let i = 0; i < litEdges.length; i += 2) {
        const edge = litEdges[i];
        const activation = Math.min(1, litEdges[i + 1]);
        ctx.strokeStyle = rgba(mix(palette.idle, palette.active, activation), 0.22 + activation * 0.53);
        ctx.beginPath();
        ctx.moveTo(edge.a.x, edge.a.y);
        ctx.lineTo(edge.b.x, edge.b.y);
        ctx.stroke();
      }

      ctx.lineWidth = 1.5;
      for (const pulse of pulses) {
        const a = pulse.edge.a;
        const b = pulse.edge.b;
        const t = Math.min(1, pulse.t);
        const t0 = Math.max(0, t - 36 / pulse.length);
        const x = a.x + (b.x - a.x) * t;
        const y = a.y + (b.y - a.y) * t;
        const x0 = a.x + (b.x - a.x) * t0;
        const y0 = a.y + (b.y - a.y) * t0;
        const gradient = ctx.createLinearGradient(x0, y0, x, y);
        gradient.addColorStop(0, rgba(palette.active, 0));
        gradient.addColorStop(1, rgba(palette.active, 0.8 * pulse.strength));
        ctx.strokeStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.fillStyle = rgba(palette.active, 0.9 * pulse.strength);
        ctx.beginPath();
        ctx.arc(x, y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const node of nodes) {
        const activation = Math.min(1, node.act);
        ctx.fillStyle = rgba(mix(palette.idle, palette.active, activation), 0.85 + 0.15 * activation);
        ctx.beginPath();
        ctx.arc(node.x, node.y, 1.6 + 1.6 * activation, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function frame(now) {
      raf = window.requestAnimationFrame(frame);
      const dt = Math.min(50, now - (last || now));
      last = now;
      const easing = 1 - Math.exp(-dt / 70);
      mouse.sx += (mouse.x - mouse.sx) * easing;
      mouse.sy += (mouse.y - mouse.sy) * easing;
      mouse.strength += ((mouse.active ? 1 : 0) - mouse.strength) * (1 - Math.exp(-dt / 250));

      for (const node of nodes) {
        const dx = mouse.sx - node.bx;
        const dy = mouse.sy - node.by;
        const distanceSquared = dx * dx + dy * dy;
        let proximity = 0;
        if (distanceSquared < 170 * 170 && mouse.strength > 0.001) {
          proximity = 1 - Math.sqrt(distanceSquared) / 170;
          proximity = proximity * proximity * (3 - 2 * proximity) * mouse.strength;
        }
        node.prox = proximity;
        const driftX = reducedMotion ? 0 : Math.sin(now * 0.0005 * node.speed + node.phase) * 5;
        const driftY = reducedMotion ? 0 : Math.cos(now * 0.0004 * node.speed + node.phase * 1.3) * 5;
        node.x = node.bx + driftX + dx * proximity * 0.18;
        node.y = node.by + driftY + dy * proximity * 0.18;
        node.act = Math.max(node.act * Math.exp(-dt / 450), proximity);
        node.cool -= dt;
        if (!reducedMotion && node.cool <= 0 && node.out.length && node.act > 0.55) fire(node, node.act);
      }

      if (!reducedMotion && nodes.length) {
        ambientTimer -= dt;
        if (ambientTimer <= 0) {
          ambientTimer = 1400 * (0.5 + Math.random());
          const node = nodes[Math.floor(Math.random() * nodes.length)];
          if (node.out.length) {
            node.act = Math.max(node.act, 0.8);
            fire(node, 0.85);
          }
        }
      }

      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        pulse.t += (0.28 * dt) / pulse.length;
        if (pulse.strength > pulse.edge.act) pulse.edge.act = pulse.strength;
        if (pulse.t >= 1) {
          const nextStrength = pulse.strength * 0.9;
          if (nextStrength > pulse.edge.b.act) pulse.edge.b.act = nextStrength;
          pulses[i] = pulses[pulses.length - 1];
          pulses.pop();
        }
      }

      for (const edge of edges) edge.act *= Math.exp(-dt / 350);
      draw();
    }

    function onMove(event) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
      if (!mouse.active && mouse.strength < 0.05) {
        mouse.sx = mouse.x;
        mouse.sy = mouse.y;
      }
      mouse.active = true;
    }

    function onDown(event) {
      onMove(event);
      if (reducedMotion) return;
      for (const node of nodes) {
        const dx = node.bx - mouse.x;
        const dy = node.by - mouse.y;
        if (dx * dx + dy * dy < 170 * 170 && node.out.length) {
          node.act = 1;
          fire(node, 1);
        }
      }
    }

    function onLeave() {
      mouse.active = false;
    }

    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(build, 150);
    }

    build();
    if (reducedMotion) {
      draw();
    } else {
      raf = window.requestAnimationFrame(frame);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(canvas.parentElement);

    const themeObserver = new MutationObserver(() => {
      palette = readPalette();
      draw();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    return () => {
      window.cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      resizeObserver.disconnect();
      themeObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
