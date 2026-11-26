import styles from "./TimeHorizonChart.module.css";
import { timeHorizons, DOUBLING_DAYS, METR_SOURCE_URL } from "@/app/data/metrTimeHorizons";

/*
  One point, stated simply: the length of tasks AI can reliably do is rising
  fast, and if the trend continues it reaches the range where forecasters
  expect AI to automate AI companies' coding around 2028–29.

  - Dots: METR's measured 80%-success time horizons for frontier models (2023+).
  - Solid line: the trend fitted through them; shaded band: that trend
    continued (fast-to-slow end of METR's doubling-time interval).
  - Grey band: forecasters' median estimates (AI 2027 timelines forecast).
  Detail (uncertainty, exact definitions) lives in the hover text and caption.
*/

const DAY = 86400000;
const t = (iso) => Date.parse(`${iso}T00:00:00Z`);
const TODAY = "2026-11-25";
const X_START = t("2023-01-01");
const X_END = t("2030-01-01");

// Skilled-human working time, in minutes: 8-hr day, 40-hr week, 160-hr month,
// 2000-hr year (as in the AI 2027 timelines forecast). Examples are illustrative.
const HOUR = 60;
const Y_TICKS = [
  { min: 1, label: "1 min", example: "look up a fact" },
  { min: HOUR, label: "1 hr", example: "fix a bug" },
  { min: 8 * HOUR, label: "1 day", example: "build a feature" },
  { min: 40 * HOUR, label: "1 week", example: "build an app" },
  { min: 160 * HOUR, label: "1 month" },
  { min: 2000 * HOUR, label: "1 year" },
  { min: 20000 * HOUR, label: "10 years" },
];
const Y_MIN = 0.35;
const Y_MAX = 40000 * HOUR;

// Forecasters' median estimates of the 80% horizon at which AI could do the
// coding work of an AI company's engineers ("superhuman coder"): Nikola
// Jurkovic 1.5 work-months, Eli Lifland 10 work-years. AI 2027 timelines
// forecast, April 2025.
const THRESHOLD = { low: 1.5 * 160 * HOUR, high: 10 * 2000 * HOUR, url: "https://ai-2027.com/research/timelines-forecast" };

// Frontier models since 2023, as METR fits them (excluding 50% horizons > 16 hrs).
const points = timeHorizons.filter((p) => p.frontier && p.released >= "2023");
const fitPoints = points.filter((p) => p.p50.minutes <= 16 * HOUR);
const INTERCEPT =
  fitPoints.reduce((sum, p) => sum + Math.log2(p.p80.minutes) - t(p.released) / DAY / DOUBLING_DAYS.estimate, 0) /
  fitPoints.length;
const trendAt = (ms) => 2 ** (INTERCEPT + ms / DAY / DOUBLING_DAYS.estimate);
const LAST = Math.max(...points.map((p) => t(p.released)));
const START_VALUE = trendAt(LAST);
const projected = (ms, days) => START_VALUE * 2 ** ((ms - LAST) / DAY / days);
const reaches = (minutes, days) => LAST + Math.log2(minutes / START_VALUE) * days * DAY;
const ENTERS = { early: reaches(THRESHOLD.low, DOUBLING_DAYS.low), late: reaches(THRESHOLD.low, DOUBLING_DAYS.high) };

const yearOnly = (ms) => new Date(ms).getUTCFullYear();
const monthYear = (ms) =>
  new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(ms));
const formatHorizon = (minutes) =>
  minutes < 60 ? `${minutes < 10 ? minutes.toFixed(1) : Math.round(minutes)} min` : `${(minutes / 60).toFixed(1)} hrs`;
const RANGE = `${yearOnly(ENTERS.early)}–${yearOnly(ENTERS.late)}`;
const SUMMARY = `Length of tasks frontier AI can do with 80% success, measured by METR: from about a minute in 2023 to about 3 hours in 2026. If the trend continues, it reaches the range where forecasters expect AI to automate AI companies' coding in ${RANGE}.`;

function Chart({ width, height, font, margin, examples, labels, className }) {
  const plotW = width - margin.left - margin.right;
  const plotH = height - margin.top - margin.bottom;
  const x = (ms) => margin.left + ((ms - X_START) / (X_END - X_START)) * plotW;
  const y = (min) =>
    margin.top + plotH - ((Math.log10(min) - Math.log10(Y_MIN)) / (Math.log10(Y_MAX) - Math.log10(Y_MIN))) * plotH;
  const clampY = (min) => y(Math.min(Math.max(min, Y_MIN), Y_MAX));
  const right = width - margin.right;
  const bottom = margin.top + plotH;

  const steps = 40;
  const at = (i) => LAST + ((X_END - LAST) * i) / steps;
  const line = (days) => Array.from({ length: steps + 1 }, (_, i) => [x(at(i)), clampY(projected(at(i), days))]);
  const path = (pts) => pts.map(([px, py], i) => `${i ? "L" : "M"}${px.toFixed(1)},${py.toFixed(1)}`).join("");
  const lower = line(DOUBLING_DAYS.high);
  const band = `${path(line(DOUBLING_DAYS.low))}${[...lower].reverse().map(([px, py]) => `L${px.toFixed(1)},${py.toFixed(1)}`).join("")}Z`;

  const thTop = y(THRESHOLD.high);
  const thBottom = y(THRESHOLD.low);
  const id = (s) => `${className}-${s}`;
  const midProj = (ms) => [x(ms), y(projected(ms, DOUBLING_DAYS.estimate))];
  const [labelX, labelY] = midProj(t("2027-03-01"));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={`${styles.svg} ${className}`} style={{ "--font": `${font}px` }} role="img" aria-labelledby={id("title")}>
      {/* One string: <title> must be a single text node or React's hydration mismatches. */}
      <title id={id("title")}>{SUMMARY}</title>
      <defs>
        <linearGradient id={id("band")} x1="0" x2="1" y1="1" y2="0">
          <stop offset="0" style={{ stopColor: "var(--chart)" }} stopOpacity="0.35" />
          <stop offset="1" style={{ stopColor: "var(--chart)" }} stopOpacity="0.05" />
        </linearGradient>
        <clipPath id={id("clip")}>
          <rect x={margin.left} y={margin.top} width={plotW} height={plotH} />
        </clipPath>
      </defs>

      {/* Forecasters' range */}
      <rect x={margin.left} y={thTop} width={plotW} height={thBottom - thTop} className={styles.threshold} />
      <text x={margin.left + font * 0.6} y={thTop + font * 1.4} className={styles.thresholdLabel}>
        AI could automate AI companies&rsquo; coding
      </text>
      <text x={margin.left + font * 0.6} y={thTop + font * 2.5} className={styles.thresholdSub}>
        forecasters&rsquo; range
      </text>

      {/* Gridlines: time on the axis, an example task at the right end of the line */}
      {Y_TICKS.map((tick) => (
        <g key={tick.label}>
          <line x1={margin.left} x2={right} y1={y(tick.min)} y2={y(tick.min)} className={styles.grid} />
          <text x={margin.left - font * 0.5} y={y(tick.min)} className={styles.tick} textAnchor="end" dominantBaseline="middle">
            {tick.label}
          </text>
          {examples && tick.example && (
            <text x={right} y={y(tick.min) - font * 0.4} className={styles.example} textAnchor="end">
              {tick.example}
            </text>
          )}
        </g>
      ))}

      <g clipPath={`url(#${id("clip")})`}>
        <path d={band} fill={`url(#${id("band")})`} />
        <path
          d={`M${x(X_START).toFixed(1)},${y(trendAt(X_START)).toFixed(1)}L${x(LAST).toFixed(1)},${y(START_VALUE).toFixed(1)}`}
          className={styles.trend}
        />
      </g>
      <text x={labelX + font * 0.6} y={labelY + font * 0.3} className={styles.projectionLabel}>
        if the trend continues
      </text>

      {/* Where it enters the forecasters' range */}
      <line x1={x(ENTERS.early)} x2={x(ENTERS.late)} y1={thBottom} y2={thBottom} className={styles.enters} />
      <text x={x((ENTERS.early + ENTERS.late) / 2)} y={thBottom + font * 1.35} className={styles.entersLabel} textAnchor="middle">
        {RANGE}
      </text>

      {/* Today (labelled at the top, clear of the year ticks) */}
      <line x1={x(t(TODAY))} x2={x(t(TODAY))} y1={margin.top} y2={bottom} className={styles.today} />
      <text x={x(t(TODAY)) - font * 0.4} y={margin.top + font * 0.9} className={styles.todayLabel} textAnchor="end">
        today
      </text>

      {/* x axis */}
      <line x1={margin.left} x2={right} y1={bottom} y2={bottom} className={styles.axis} />
      {[2023, 2025, 2027, 2029].map((yr) => (
        <text key={yr} x={x(Date.UTC(yr, 0, 1))} y={bottom + font * 1.3} className={styles.tick} textAnchor="middle">
          {yr}
        </text>
      ))}


      {/* Measurements */}
      {points.map((p) => {
        const px = x(t(p.released));
        const py = y(p.p80.minutes);
        return (
          <g key={p.name} className={styles.point} tabIndex={0}>
            <title>{`${p.name} (${monthYear(t(p.released))}): ${formatHorizon(p.p80.minutes)}`}</title>
            <circle cx={px} cy={py} r={font * 0.3} className={styles.dot} />
            {t(p.released) === LAST && (
              <circle cx={px} cy={py} r={font * 0.3} className={styles.nowRing} aria-hidden="true" />
            )}
            {labels[p.name] && (
              <text
                x={labels[p.name].above ? px : px - font * 0.55}
                y={labels[p.name].above ? py - font * 0.85 : py}
                className={styles.pointLabel}
                textAnchor={labels[p.name].above ? "start" : "end"}
                dominantBaseline="middle">
                {labels[p.name].text}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export default function TimeHorizonChart() {
  return (
    <figure className={styles.figure}>
      <p className={styles.title}>How long a task AI can reliably do</p>
      <Chart
        className="th-wide"
        width={1348}
        height={560}
        font={19}
        margin={{ top: 10, right: 10, bottom: 44, left: 80 }}
        examples
        labels={{
          "GPT-4": { text: "GPT-4", above: true },
          "Claude Mythos Preview (early)": { text: "Claude Mythos Preview" },
        }}
      />
      <Chart
        className="th-narrow"
        width={700}
        height={640}
        font={24}
        margin={{ top: 8, right: 8, bottom: 52, left: 100 }}
        examples={false}
        labels={{
          "GPT-4": { text: "GPT-4", above: true },
          "Claude Mythos Preview (early)": { text: "Mythos Preview" },
        }}
      />
      <figcaption className={styles.caption}>
        Tasks AI agents complete 80% of the time, in a skilled human&rsquo;s working time. Data:{" "}
        <a href={METR_SOURCE_URL} target="_blank" rel="noopener noreferrer">
          METR
        </a>{" "}
        (to {monthYear(LAST)}). Forecasters&rsquo; range: median estimates from the{" "}
        <a href={THRESHOLD.url} target="_blank" rel="noopener noreferrer">
          AI 2027 timelines forecast
        </a>
        .
      </figcaption>
    </figure>
  );
}
