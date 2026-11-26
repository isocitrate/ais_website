import React from "react";
import Link from "next/link";
import styles from "./page.module.css";
import PageLayout from "@/app/ui/PageLayout";

export const metadata = {
  title: "Get involved - AI Safety Group @ UChicago XLab",
  description:
    "Get Involved with the AI Safety Group @ UChicago XLab. Apply for our programs, join our mailing list and Slack, or reach out to us directly.",
  keywords: "AI safety, AI alignment, University of Chicago, x-risk lab, AI research",
};

const MAILING_LIST_URL = "https://lists.uchicago.edu/web/info/aisafety";
const SLACK_URL =
  "https://join.slack.com/t/xlab-uchicago/shared_invite/zt-47zdem4lv-vncDwWYv3WTBCHvK8ZgN8Q";
const LEADERSHIP_ROLES_URL =
  "https://docs.google.com/document/d/1oxUyMg42swaz4c9TsFLqU9Vc58kAB1dEL1auvYl0zG8/edit?usp=sharing";

// An application button that isn't live yet: shown greyed out, not clickable.
// When applications open, replace it with a maroon link (styles.actionButton).
function ClosedButton({ children }) {
  return (
    <span className={styles.closedButton} aria-disabled="true">
      {children}
    </span>
  );
}

export default function GetInvolved() {
  return (
    <PageLayout title="Get involved">
      <div className={styles.grid}>
        <section id="apply" className={styles.section}>
          <h2 className={styles.sectionTitle}>Apply for our programs</h2>
          <p className={styles.sectionText}>
            Each quarter we run{" "}
            <Link href="/fellowships" className={styles.link}>
              fellowships
            </Link>
            ,{" "}
            <Link href="/fellowships#reading" className={styles.link}>
              reading groups
            </Link>
            ,{" "}
            <Link href="/working-groups" className={styles.link}>
              working groups
            </Link>
            , and the{" "}
            <Link href="/writing-room" className={styles.link}>
              writing room
            </Link>
            , open to students from any background. Applications open at the start of each quarter;
            join the mailing list below to hear when they do.
          </p>
          <ClosedButton>Applications open in winter</ClosedButton>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Stay in touch</h2>
          <p className={styles.sectionText}>
            Our mailing list is the best way to hear about events, applications, and opportunities.
            On our Slack we share opportunities, discuss the latest in AI safety, and coordinate
            programming. Come say hi!
          </p>
          <div className={styles.buttonRow}>
            <a href={MAILING_LIST_URL} target="_blank" rel="noopener noreferrer" className={styles.actionButton}>
              Join our mailing list
            </a>
            <a href={SLACK_URL} target="_blank" rel="noopener noreferrer" className={styles.actionButton}>
              Join our Slack
            </a>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Apply for leadership</h2>
          <p className={styles.sectionText}>
            Applications for leadership are currently closed. Please reach out to us directly if you
            want to get involved! See an{" "}
            <a href={LEADERSHIP_ROLES_URL} target="_blank" rel="noopener noreferrer" className={styles.link}>
              example list of roles
            </a>{" "}
            from Autumn 2026.
          </p>
          <ClosedButton>Applications closed</ClosedButton>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Contact us</h2>
          <p className={styles.sectionText}>
            Have questions or want to learn more? Don&#39;t hesitate to reach out to us directly. You
            can find our contact information in the{" "}
            <Link href="/about-us#leadership" className={styles.link}>
              leadership section
            </Link>{" "}
            of our About page.
          </p>
        </section>
      </div>
    </PageLayout>
  );
}
