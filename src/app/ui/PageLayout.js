import GradientDescentBackground from "@/app/ornaments/GradientDescentBackground";
import ui from "./layout.module.css";

// Inner-page frame: header band (static loss-landscape contours behind the floating menu,
// page title, optional intro) followed by the content column.
// `stuckBall`: a hero-height band where a ball rolls once and gets stuck in a
// local minimum (the "coming soon" page). Visitors can click to drop more.
export default function PageLayout({ title, lede, children, stuckBall = false }) {
  return (
    <>
      <header className={`${ui.band} ${stuckBall ? ui.bandTall : ""}`}>
        {stuckBall ? (
          <GradientDescentBackground outcome="stuck" />
        ) : (
          <GradientDescentBackground interactive={false} />
        )}
        <div className={`${ui.container} ${ui.bandInner}`}>
          <h1 className={ui.title}>{title}</h1>
          {lede && <div className={ui.lede}>{lede}</div>}
        </div>
      </header>
      <div className={`${ui.container} ${ui.content}`}>{children}</div>
    </>
  );
}
