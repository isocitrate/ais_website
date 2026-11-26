import React from "react";
import styles from "./page.module.css";
import PageLayout from "@/app/ui/PageLayout";
import LeadershipSection from "./LeadershipSection";

export const metadata = {
  title: "About us - AI Safety Group @ UChicago XLab",
  description: "Learn about the AI Safety Group @ UChicago XLab, a student-led initiative studying AI safety at the University of Chicago, and meet our leadership team.",
  keywords: "AI safety, University of Chicago, about, student organization",
};

export default function AboutUs() {
  return (
    <PageLayout title="About us">
      <section className={styles.section}>
        <p className={styles.text}>
          We are a student organization affiliated with the University of Chicago&apos;s{" "}
          <a
            href="https://xrisk.uchicago.edu/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}>
            Existential Risk Laboratory
          </a>{" "}
          dedicated to fostering education, research, and discourse in AI safety. The advent of
          extraordinarily advanced AI places human civilization at an unprecedented precipice.
          Ensuring AI systems are aligned with human values, securely deployed, and effectively
          regulated will likely be the most consequential issue faced in our lifetimes. To best
          equip students to contribute to these goals, our work comprises three main components:
        </p>
        <ul className={styles.list}>
          <li>
            Running quarterly fellowship programs across AI safety, security, strategy, and
            governance
          </li>
          <li>Organizing talks, symposia, and community events</li>
          <li>Supporting and funding student-led research projects</li>
        </ul>
      </section>

      <LeadershipSection />

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>The Existential Risk Laboratory (XLab)</h2>
        <p className={styles.text}>
          Founded in 2022 at the University of Chicago, the Existential Risk Laboratory (XLab) is an
          interdisciplinary research organization dedicated to the analysis and mitigation of risks
          that threaten human civilization&apos;s long-term survival. XLab focuses on critically
          under-addressed areas, including AI safety and security, biorisks, nuclear security, and
          extreme climate change. Since these issues don&apos;t fit neatly into pre-existing
          academic silos, XLab was created to serve as a coordinating locus for work on existential
          and global catastrophic risk on the UChicago campus. It supports direct research and
          provides a venue for students to build expertise in its focus areas.
        </p>
      </section>
    </PageLayout>
  );
}
