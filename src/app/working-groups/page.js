import styles from "./page.module.css";
import PageLayout from "@/app/ui/PageLayout";

export const metadata = {
  title: "Working groups - AI Safety Group @ UChicago XLab",
  description:
    "Quarter-long research projects from the AI Safety Group @ UChicago XLab, tackling open questions in technical AI safety, threat modeling, and geopolitics.",
  keywords: "AI safety, working groups, research, University of Chicago, threat modeling",
};

// Content from the Autumn 2026 working groups announcement (DOC_URL).
const DOC_URL =
  "https://docs.google.com/document/d/1IQzu9DFuPhOlDSAsksqDNyqULyAXCw57wL9LfqqEJGo/edit?usp=sharing";
const MAILING_LIST_URL = "https://lists.uchicago.edu/web/info/aisafety";
const MICROGRANT_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSePDioF65VpN3JjF1selokD5ZyO8FnFtH2PqTGSL8AMO6G7qQ/viewform?usp=dialog";

const groups = [
  {
    name: "State of AI Safety Reports",
    leads: "Julian Huang and Rhea Kanuparthi",
    paid: true,
    description: [
      "Researchers study the most prominent AI safety research agendas in depth, writing a critical evaluation or living literature review. They synthesize an agenda’s progress, often dispersed across many sources, weigh it against empirical evidence about current AI systems and the views of researchers in the subfield, and evaluate whether the field is on track, with recommendations for where to direct effort and funding.",
      "Along the way, you’ll learn the agenda’s goals and central papers, speak with researchers in the subfield, potentially run your own experiments, and effectively become an expert on it by the end.",
    ],
    topicsTitle: "Subfields we’re interested in",
    topics: [
      "Personas and generalization",
      "Scalable oversight and debate",
      "AI security and misuse prevention",
      "AI control",
      "Theoretical alignment agendas (agent foundations, ARC’s work, etc.)",
      "Proposals for other agendas worth reviewing",
    ],
    lookingFor: [
      "A strong background in technical AI safety and comfort reading ML papers critically",
      "Strong writing and communication skills, including explaining complex ideas clearly to a broad audience",
    ],
  },
  {
    name: "Concrete AGI Scenarios: Geopolitics and Threat Modeling",
    leads: "Rhea Kanuparthi and Julian Huang",
    paid: true,
    description: [
      "When we talk about AI risk with general audiences, one question comes up again and again: “How would AI actually kill us all?” Several organizations have published broad scenarios of AI takeover, but it’s still hard to picture concretely how AI could threaten human survival.",
      "This group identifies, assesses, and describes AI threat models: spelling out what superintelligence might actually look like, and exploring how different actors might use those capabilities. Researchers write reports that walk through, step by step, how individuals, organizations, and states might use AI, be targeted by it, and ultimately be harmed by it.",
    ],
    topicsTitle: "Threat models we’re interested in",
    topics: [
      "How could a lead in AI capabilities give one country a decisive strategic advantage? If the US were six months ahead of China, what would it do with that time?",
      "How could AGI lead to wider geopolitical conflict and raise the risk of nuclear war?",
      "Could rogue AIs compromise industrial firmware, IoT devices, and other critical infrastructure, and use that access to resist shutdown or coerce governments?",
      "Other threat models you’d like to suggest",
    ],
    lookingFor: [
      "A solid understanding of what AI systems can do today and how quickly their capabilities are advancing",
      "A background or strong interest in geopolitics, especially US and Chinese military capabilities, political systems, and economic strength",
      "Strong writing and communication skills, including explaining complex ideas clearly to a broad audience",
    ],
  },
];

export default function WorkingGroups() {
  return (
    <PageLayout
      title="Working groups"
      lede={
        <>
          <p>
            Our working groups offer research opportunities across the technical, strategic, and
            governance dimensions of AI safety.
          </p>
          <p>
            Applications for working groups are currently closed and expected to open in early
            January for Winter 2027. Join our{" "}
            <a href={MAILING_LIST_URL} target="_blank" rel="noopener noreferrer">
              mailing list
            </a>{" "}
            to be notified when applications open.
          </p>
        </>
      }>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>What we do</h2>
        <p className={styles.text}>
          We aim to do rigorous, high-quality research at the frontier on important unresolved
          questions at the intersection of technical AI safety, threat modeling, and geopolitics,
          focusing on topics likely to move the needle and push the field forward. Our projects
          address gaps that grantmakers and leaders in the field have highlighted as critical.
        </p>
        <p className={styles.text}>
          Apply even if you don’t fit the listed qualifications. What matters most is curiosity
          about the topic, careful thinking, research ability, and the ability to get things past
          the finish line.
        </p>
        <ul className={styles.facts}>
          <li>
            <span className={styles.factLabel}>Who</span>
            Open to all UChicago undergraduate and graduate students
          </li>
          <li>
            <span className={styles.factLabel}>When</span>
            Meet weekly from early in the quarter through its end
          </li>
          <li>
            <span className={styles.factLabel}>Commitment</span>
            About 10 hours a week, with a $1,500 stipend
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Autumn 2026 working groups</h2>
        <div className={styles.groups}>
          {groups.map((group) => (
            <article key={group.name} className={styles.group}>
              <div className={styles.groupIntro}>
                <h3 className={styles.groupName}>{group.name}</h3>
                {group.description.map((para) => (
                  <p key={para.slice(0, 24)} className={styles.text}>
                    {para}
                  </p>
                ))}
              </div>
              {group.topics && (
                <div className={styles.groupDetails}>
                  <h4 className={styles.listTitle}>{group.topicsTitle}</h4>
                  <ul className={styles.list}>
                    {group.topics.map((topic) => (
                      <li key={topic}>{topic}</li>
                    ))}
                  </ul>
                  <h4 className={styles.listTitle}>We’re looking for one or more of</h4>
                  <ul className={styles.list}>
                    {group.lookingFor.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          ))}
        </div>
        <a href={DOC_URL} target="_blank" rel="noopener noreferrer" className={styles.docLink}>
          Read the full Autumn 2026 announcement
        </a>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Compute microgrants</h2>
        <p className={styles.text}>
          Working on your own technical AI safety project? We offer funding for compute (renting
          GPUs or buying API credits), typically $10–$1,000, plus lighter-touch mentorship.
          Projects can range from novel research ideas to replications of existing work to
          upskilling projects. Open to all UChicago students; we especially prioritize promising
          projects, applicants with a clear plan or track record, and people seriously considering
          AI safety research or careers.
        </p>
        <p className={styles.text}>
          Questions or looking for project ideas? Email{" "}
          <a href="mailto:julianhuang@uchicago.edu" className={styles.link}>
            julianhuang@uchicago.edu
          </a>
          .
        </p>
        <a href={MICROGRANT_FORM_URL} target="_blank" rel="noopener noreferrer" className={styles.button}>
          Apply for a microgrant
        </a>
      </section>
    </PageLayout>
  );
}
