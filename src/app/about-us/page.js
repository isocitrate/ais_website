import React from "react";
import Image from "next/image";
import styles from "./page.module.css";
import NeuralBackground from "@/app/ornaments/NeuralBackground";

// `invert` marks dark-on-transparent logos that flip to light silhouettes in
// dark mode; logos with their own dark backgrounds stay as they are.
const alumniOrgs = [
  { name: "Anthropic", src: "/Anthropic-Logo.wine.svg", href: "https://www.anthropic.com", invert: true },
  { name: "MATS", src: "/mats.svg", href: "https://www.matsprogram.org", invert: true },
  { name: "Google DeepMind", src: "/DeepMind_new_logo.svg.png", href: "https://deepmind.google", invert: true },
  { name: "OpenAI", src: "/openai.png", href: "https://openai.com", invert: true },
  { name: "Redwood Research", src: "/redwood.png", href: "https://www.redwoodresearch.org", invert: true },
  { name: "AI Futures Project", src: "/ai_futures_project_logo.jpg", href: "https://www.aifutures.org" },
  { name: "Gray Swan", src: "/gray-swan-og-image.png", href: "https://www.grayswan.ai" },
  { name: "Epoch AI", src: "/epoch.png", href: "https://epoch.ai", invert: true },
];

export const metadata = {
  title: "About Us - AI Safety Group @ UChicago XLab",
  description: "Learn about the AI Safety Group @ UChicago XLab, a student-led initiative studying AI safety at the University of Chicago.",
  keywords: "AI safety, University of Chicago, about, student organization",
};

export default function AboutUs() {
  return (
    <div className={styles.pageWrap}>
      <NeuralBackground transparent clearWidth={860} />
      <div className={styles.aboutContainer}>
        <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>About Us</h1>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>AI Safety Group @ UChicago XLab</h2>
        <p className={styles.bodyText}>
          We are a student organization affiliated with the University of Chicago's{" "}
          <a
            href="https://xrisk.uchicago.edu/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.inlineLink}>
            Existential Risk Laboratory 
          </a> dedicated to fostering education, research, and discourse in AI safety. The advent of extraordinarily advanced AI places human civilization at an unprecedented precipice. Ensuring AI systems are aligned with human values, securely deployed, and effectively regulated will likely be the most consequential issue faced in our lifetimes. To best equip students to contribute to these goals, our work comprises three main components: 
        </p>
        <ul className={styles.bodyList}>
          <li>
            Running quarterly fellowship programs across AI safety, security, strategy, and governance
          </li>
          <li>
            Organizing talks, symposia, and community events 
          </li>
          <li>
            Supporting and funding student-led research projects 
          </li>
        </ul>
        <p className={styles.bodyText}>
          
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>The Existential Risk Laboratory (XLab)</h2>
        <p className={styles.bodyText}>
          Founded in 2022 at the University of Chicago, the Existential Risk Laboratory (XLab) is an
          interdisciplinary research organization dedicated to the analysis and mitigation of risks
          that threaten human civilization&apos;s long-term survival. XLab focuses on critically
          under-addressed areas, including AI safety and security, biorisks, nuclear security, and extreme climate change.
          Since these issues don&apos;t fit neatly into pre-existing academic silos, XLab was
          created to serve as a coordinating locus for work on existential and global catastrophic
          risk on the UChicago campus. It supports direct research and provides a venue for students to build expertise in its focus
          areas.
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Our members have worked with</h2>
        <div className={styles.logoGrid}>
          {alumniOrgs.map((org) => (
            <a
              key={org.name}
              href={org.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.logoItem}
              title={org.name}>
              <Image
                src={org.src}
                alt={org.name}
                fill
                className={org.invert ? "dark-invert" : undefined}
                style={{ objectFit: "contain" }}
              />
            </a>
          ))}
        </div>
      </section>
      </div>
    </div>
  );
}
