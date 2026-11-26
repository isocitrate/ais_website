import styles from "./page.module.css";
import PageLayout from "@/app/ui/PageLayout";

export const metadata = {
  title: "Writing room - AI Safety Group @ UChicago XLab",
  description:
    "Focused writing sessions from the AI Safety Group @ UChicago XLab, with structure and mentorship to publish blog posts on AI safety.",
  keywords: "AI safety, writing, blog posts, University of Chicago",
};

const MAILING_LIST_URL = "https://lists.uchicago.edu/web/info/aisafety";

// Content from the Autumn 2026 working groups announcement ("Blogpost writing groups").
export default function WritingRoom() {
  return (
    <PageLayout
      title="Writing room"
      lede={
        <>
          <p>Focused writing sessions to hone your writing and communication skills.</p>
          <p>
            Join our{" "}
            <a href={MAILING_LIST_URL} target="_blank" rel="noopener noreferrer">
              mailing list
            </a>{" "}
            to hear when the next round opens.
          </p>
        </>
      }>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Blogpost writing groups</h2>
        <p className={styles.text}>
          Many members have ideas they’ve meant to write up for months but haven’t found the time.
          This group provides the structure and mentorship to publish them: we meet weekly to share
          progress and cowork, with feedback along the way and the goal of publishing at least one
          piece over the quarter.
        </p>
        <p className={styles.text}>
          Writing, in public or private, is a great way to learn a topic deeply and to make what you
          already know legible to others. Pieces can range from smaller technical side projects to
          policy memos (we can split into groups with similar interests) or something else
          entirely. There’s no need to have your idea set in stone.
        </p>
        <ul className={styles.facts}>
          <li>
            <span className={styles.factLabel}>Who</span>
            Open to all UChicago students; past XLab participants especially encouraged
          </li>
          <li>
            <span className={styles.factLabel}>When</span>
            Weekly coworking sessions through the quarter
          </li>
          <li>
            <span className={styles.factLabel}>Commitment</span>
            Unpaid; no required time beyond the coworking sessions
          </li>
        </ul>
      </section>
    </PageLayout>
  );
}
