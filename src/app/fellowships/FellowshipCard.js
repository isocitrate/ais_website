import Link from "next/link";
import styles from "./page.module.css";

// A fellowship is a featured, actionable item, so it gets the grey box — and,
// like the homepage program cards, its title is the link (to the syllabus).
// Without an application link it says so plainly instead of offering an
// "Apply" button that only reveals a "closed" message.
function SyllabusLink({ href, className, children }) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}

// No syllabusHref (e.g. the paper reading group, which picks papers each week): no syllabus link.
export default function FellowshipCard({ name, description, syllabusHref, applyHref }) {
  return (
    <div className={syllabusHref ? styles.fellowshipCardLink : styles.fellowshipCard}>
      <h2 className={styles.fellowshipName}>
        {syllabusHref ? (
          <SyllabusLink href={syllabusHref} className={styles.fellowshipNameLink}>
            {name}
          </SyllabusLink>
        ) : (
          name
        )}
      </h2>
      <p className={styles.fellowshipDescription}>{description}</p>
      <div className={styles.cardFooter}>
        {syllabusHref && (
          <SyllabusLink href={syllabusHref} className={styles.syllabusLink}>
            View syllabus
          </SyllabusLink>
        )}
        {applyHref ? (
          <a href={applyHref} target="_blank" rel="noopener noreferrer" className={styles.applyButton}>
            Apply
          </a>
        ) : (
          <span className={styles.applicationsClosed}>Applications closed</span>
        )}
      </div>
    </div>
  );
}
