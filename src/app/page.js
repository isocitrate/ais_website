import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";
import CallToActionLinks from "@/app/CallToActionLinks/CallToActionLinks";
import NeuralBackground from "@/app/ornaments/NeuralBackground";

export const metadata = {
  title: "AI Safety Group @ UChicago XLab",
  description:
    "UChicago's student-led initiative studying AI safety, sponsored by the x-risk lab.",
  keywords:
    "AI safety, AI alignment, University of Chicago, x-risk lab, AI research",
};

const pillars = [
  {
    title: "Fellowships",
    description:
      "Six fellowship tracks spanning alignment fundamentals, policy and governance, economics, strategy, and AI security — open to students from any background.",
    href: "/fellowships",
    linkText: "Explore fellowships",
  },
  {
    title: "Research",
    description:
      "Publications and working papers across technical safety, strategy, and governance — building the foundation for high-impact careers in the field.",
    href: "/research",
    linkText: "Read our research",
  },
  {
    title: "Community",
    description:
      "Speaker events, symposia, and retreats that connect motivated students to each other and to researchers working on AI safety today.",
    href: "/events",
    linkText: "See upcoming events",
  },
];

export default function Home() {
  return (
    <>
      <section className={styles.hero}>
        <NeuralBackground />
        <div className={styles.heroInner}>
          <div className={styles.heroBrand} aria-label="AI Safety Group at UChicago XLab">
            <Image
              src="/lockup1_red.png"
              alt="AI Safety Group at UChicago XLab"
              width={1731}
              height={380}
              priority
              className={styles.heroLockupLight}
            />
            <Image
              src="/lockup1_white.png"
              alt="AI Safety Group at UChicago XLab"
              width={1731}
              height={379}
              priority
              className={styles.heroLockupDark}
            />
          </div>
          <p className={styles.heroLede}>
            We care about reducing risks from advanced
            AI and ensuring its development remains in the interests of humanity.
          </p>
          <div className={styles.heroCtas}>
            <Link href="/about-us" className={styles.ctaPrimary}>
              Learn more about us <span aria-hidden="true">→</span>
            </Link>
            <Link href="/get-involved" className={styles.ctaPrimary}>
              Get involved <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.pillarsSection} hidden>
        <h2 className={styles.sectionTitle}>What we do</h2>
        <div className={styles.pillars}>
          {pillars.map((pillar) => (
            <div key={pillar.title} className={styles.pillar}>
              <h3 className={styles.pillarTitle}>{pillar.title}</h3>
              <p className={styles.pillarDescription}>{pillar.description}</p>
              <Link href={pillar.href} className={styles.pillarLink}>
                {pillar.linkText} <span aria-hidden="true">→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <div hidden>
        <CallToActionLinks />
      </div>
    </>
  );
}
