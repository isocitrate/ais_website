import React from "react";
import Image from "next/image";
import styles from "./page.module.css";
import PageLayout from "@/app/ui/PageLayout";

export const metadata = {
  title: "Research - AI Safety Group @ UChicago XLab",
  description: "Research initiatives at the AI Safety Group @ UChicago XLab.",
  keywords: "AI safety, research, University of Chicago",
};

const papers = [
  {
    title: "Iterative Finetuning is Mostly Idempotent",
    href: "https://arxiv.org/abs/2605.01130",
    image: "/iterative-finetuning.png",
  },
  {
    title: "Narrow RL Induces Broad Behavior Changes in LLMs",
    href: "https://openreview.net/forum?id=dPE0mEjUzp",
    image: "/narrow-rl.png",
  },
  {
    title: "Measuring Free-Form Decision-Making Inconsistency of Language Models in Military Crisis Simulations",
    href: "https://arxiv.org/abs/2410.13204",
    image: "/measuring-free-form.png",
  },
  {
    title: "Certified Safe: A Schematic for Approval Regulation of Frontier AI",
    href: "https://arxiv.org/abs/2408.06210",
    image: "/certified-safe.png",
    keepColors: true,
  },
  {
    title: "A California Effect For Artificial Intelligence",
    href: "https://bpb-us-w2.wpmucdn.com/voices.uchicago.edu/dist/9/3887/files/2024/02/JosephsonXLabSRF22-CaliforniaEffectAI-fa2b6d382dfdd902.pdf",
    image: "/california-effect.png",
  },
  {
    title: "Rethinking Priorities for Frontier AI Security",
    href: "http://bpb-us-w2.wpmucdn.com/voices.uchicago.edu/dist/9/3887/files/2026/03/Rethinking-Priorities-for-Frontier-AI-Security.pdf",
    image: "/rethinking priorities.png",
  },
  {
    title: "Position: Why AI R&D Benchmarks Need to Measure Research Judgment Separately",
    href: "https://bpb-us-w2.wpmucdn.com/voices.uchicago.edu/dist/9/3887/files/2026/03/Position-Why-AI-RD-Benchmarks-Need-to-Measure-Research-Judgment-Separately.pdf",
    image: "/position-why.png",
  },
  {
    title: "Forbidden Facts: An Investigation of Competing Objectives in Llama-2",
    href: "https://arxiv.org/abs/2312.08793",
    image: "/forbidden-facts.png",
  },
  {
    title: "Global Governance of High-Risk Artificial Intelligence",
    href: "https://bpb-us-w2.wpmucdn.com/voices.uchicago.edu/dist/9/3887/files/2024/02/FINALLlerenaXLabSRF23-GlobalGovernanceOfHighRiskAI-0334e1dd25e37cae.pdf",
    image: "/global-governance.png",
  },
];

const otherAreas = [
  "Agent foundations and decision theory",
  "Control protocols and runtime monitoring of AI systems",
  "Mechanistic and concept-level interpretability",
  "Capability evaluations and benchmarking",
  "Adversarial robustness and deployment safeguards",
  "Game-theoretic modeling and threat assessment",
  "Hardware interventions and compute proliferation dynamics",
  "Model organisms, red-teaming, and deceptive alignment",
];

const areas = [
  {
    title: "Technical AI safety",
    description: (
      <>
        Understanding the empirical properties of existing frontier AI systems and developing
        theory about the properties we can expect from future systems — how they are shaped by
        different forms of training, the mechanisms behind their behavior, and how human oversight
        can scale to increasingly advanced AI.
      </>
    ),
  },
  {
    title: "Security",
    description: (
      <>
        Studying the attack surface of advanced AI systems — including model weights, training
        pipelines, deployment infrastructure, and the information-security posture of frontier
        labs. Check out our{" "}
        <a href="https://xlabaisecurity.com/" target="_blank" rel="noopener noreferrer" className={styles.link}>
          Security Guide
        </a>
        .
      </>
    ),
  },
  {
    title: "Strategy and forecasting",
    description: (
      <>
        Mapping AI development trajectories, identifying the highest-leverage interventions, and
        analyzing how transformative AI will reshape institutions, economies, and global risk.
      </>
    ),
  },
  {
    title: "Policy and governance",
    description: (
      <>
        Examining regulatory frameworks, compliance and verification mechanisms, compute
        governance, and the international coordination challenges posed by frontier AI development.
      </>
    ),
  },
];

export default function Research() {
  return (
    <PageLayout
      title="Research"
      lede={
        <p>
          Applications for research working groups are currently closed and expected to open in
          early January for Winter 2027. Join our{" "}
          <a href="https://lists.uchicago.edu/web/info/aisafety" target="_blank" rel="noopener noreferrer">
            mailing list
          </a>{" "}
          to be notified when applications open.
        </p>
      }>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Our work spans the technical, strategic, and governance aspects of AI safety</h2>
        <div className={styles.areaGrid}>
          {areas.map((area) => (
            <div key={area.title} className={styles.areaCard}>
              <h3 className={styles.areaTitle}>{area.title}</h3>
              <p className={styles.areaDescription}>{area.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Publications and working papers</h2>
        <div className={styles.papersGrid}>
          {papers.map((paper) => (
            <a
              key={paper.title}
              href={paper.href}
              target="_blank"
              rel="noopener noreferrer"
              data-arrow="none"
              className={styles.paperCard}>
              {paper.image && (
                <div className={styles.paperImageWrapper}>
                  <Image
                    src={paper.image}
                    alt=""
                    fill
                    sizes="(max-width: 700px) 50vw, 25vw"
                    className={paper.keepColors ? undefined : styles.paperImage}
                    style={{ objectFit: "cover", objectPosition: "top" }}
                  />
                </div>
              )}
              <span className={`${styles.paperTitle} externalArrow`}>{paper.title}</span>
            </a>
          ))}
        </div>
      </section>

      <section className={styles.section} hidden>
        <h2 className={styles.sectionTitle}>Other areas we actively engage with include:</h2>
        <ul className={styles.list}>
          {otherAreas.map((area) => (
            <li key={area}>{area}</li>
          ))}
        </ul>
      </section>
    </PageLayout>
  );
}
