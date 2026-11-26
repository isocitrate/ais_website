import React from "react";
import FellowshipCard from "./FellowshipCard";
import styles from "./page.module.css";
import PageLayout from "@/app/ui/PageLayout";

export const metadata = {
  title: "Fellowships - AI Safety Group @ UChicago XLab",
  description: "Fellowship programs from the AI Safety Group @ UChicago XLab, covering AI safety, governance, economics, strategy, and security.",
  keywords: "AI safety, fellowship, University of Chicago, AI governance, AI security",
};

// Sections on the page, in order. Descriptions match the homepage's program cards.
const groups = [
  {
    id: "intro",
    title: "Intro fellowships",
    description:
      "Guided weekly discussion groups introducing students to the basics of AI safety. Runs every quarter.",
  },
  {
    id: "reading",
    title: "Reading groups",
    description: "Advanced reading sessions focused on a specific AI safety topic.",
  },
  { id: "notOffered", title: "Not offered this quarter" },
];

const fellowships = [
  {
    name: "AI Safety Fundamentals",
    group: "intro",
    description:
      "Our flagship fellowship introduces fellows from any background to the core ideas in AI safety, with a particular focus on how advanced AI systems pose critical risks.",
    syllabusHref: "/ai-safety-fundamentals",
  },
  {
    name: "AI Policy",
    group: "intro",
    description:
      "This fellowship covers the foundations of AI governance, including existing policy frameworks, the differing stances of the US, China, and the EU, threats to democratic institutions posed by AI, the dynamics of international competition, impacts on labor and the economy, and data privacy. At the program's conclusion, fellows draft and defend their own policy briefs.",
    syllabusHref: "/policy-governance",
  },
  {
    name: "Economics of AI",
    group: "intro",
    description:
      "This fellowship introduces fellows to major ideas in AI safety and their relationship to economics and the economy. Topics include examining how economic incentives shape AI safety decisions, and how those decisions (or their absence) reshape the global economy in turn. By the end of the program, fellows will have a working understanding of how market mechanisms, industrial policy, regulation, and international coordination can meaningfully reduce existential risk, along with the foundation to pursue any of these threads further.",
    syllabusHref: "/economics-of-transformative-ai",
  },
  {
    name: "Technical Paper Reading Group",
    group: "reading",
    description:
      "This reading group cultivates technical literacy and research intuition by engaging directly with the AI safety literature. Each week, participants vote on a paper to read and discuss together. The goal of this group is to foster close reading, critical questioning, and collaborative debate about AI safety research. No fixed syllabus, and any intellectually curious individual is welcome to apply.",
    syllabusHref: null,
  },
  {
    name: "Strategy and Forecasting",
    group: "notOffered",
    description:
      "As frontier models grow more capable and the cost of frontier-level performance continues to fall, transformative AI is approaching quickly. Navigating it well requires a coherent picture of where AGI is headed, one that integrates technical progress with the political dynamics of an AGI arms race. This reading and discussion group is dedicated to building shared understanding around the crucial questions of transformative AI. Fellows engage in forecasting informed by scaling laws, threat modeling, and a tabletop wargame exercise, culminating in each fellow writing their own AGI takeoff scenario.",
    syllabusHref: "/strategy-group",
  },
  {
    name: "AI Security",
    group: "notOffered",
    description:
      "This fellowship introduces fellows to AI security (the study of attacks on and defenses for AI systems in adversarial settings) as a complement to the safety-focused work covered in our other programs. Fellows meet weekly to work through XLab's online AI Security course with mentorship and guidance from experienced facilitators. The curriculum builds from adversarial examples in computer vision through LLM jailbreaks, model tampering, and data poisoning and extraction attacks, with hands-on coding exercises throughout. By the end of the program, fellows will have practical familiarity with the major attack surfaces of modern AI systems and the foundation to pursue AI security research of their own.",
    syllabusHref: "https://xlabaisecurity.com/",
  },
];

export default function Fellowships() {
  return (
    <PageLayout
      title="Fellowships"
      lede={
        <>
          <p>
            Our fellowships are quarter-long weekly reading and discussion groups led by experienced
            facilitators, and are open to students from any background. Catered dinner is provided!
          </p>
          <p>
            Applications for fellowships are currently closed. We plan to open applications for
            Winter 2027 fellowships in early January. Please look out for future opportunities
            through our{" "}
            <a href="https://lists.uchicago.edu/web/info/aisafety" target="_blank" rel="noopener noreferrer">
              mailing list
            </a>
            !
          </p>
        </>
      }>
      {groups.map((group) => (
        <section key={group.id} id={group.id} className={styles.section}>
          <h2 className={styles.sectionTitle}>{group.title}</h2>
          {group.description && <p className={styles.sectionText}>{group.description}</p>}
          <div className={styles.fellowshipGrid}>
            {fellowships
              .filter((f) => f.group === group.id)
              .map((fellowship) => (
                <FellowshipCard key={fellowship.name} {...fellowship} />
              ))}
          </div>
        </section>
      ))}
    </PageLayout>
  );
}
