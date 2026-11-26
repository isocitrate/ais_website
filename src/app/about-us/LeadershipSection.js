import styles from "./leadership.module.css";
import LeadershipMember, { Email } from "./LeadershipMember";

// Leadership section of the About page (formerly /leadership). The current team
// is always shown; past organizers and advisors are tucked into click-to-open
// sections.

const executiveBoard = [
  { imgUrl: "/julian.jpg", memberName: "Julian Huang", memberRole: "Executive Board Member", memberEmail: "julianhuang@uchicago.edu", bookingUrl: "https://calendly.com/julianhuang" },
  { imgUrl: "/nicole.jpeg", memberName: "Nicole Tang",  memberRole: "Executive Board Member", memberEmail: "xhtang@uchicago.edu", bookingUrl: "https://cal.com/nicoletangxh/quickchat" },
  { imgUrl: "/justin.jpg", memberName: "Justin Chen",  memberRole: "Executive Board Member", memberEmail: "justinchen@uchicago.edu", bookingUrl: "https://cal.com/justinchen/chat" },
];

// Current organizers: each team lists its lead and generalists (exceptions:
// Research's research managers and Events' operations lead).
const autumnTeams = [
  {
    team: "Fellowships",
    groups: [
      { role: "Team Lead", members: ["Adrian Fang"] },
      { role: "Generalists", members: ["Parjanya Tiwari"] },
    ],
  },
  {
    team: "Research",
    groups: [
      { role: "Team Lead", members: ["Julian Huang"] },
      { role: "Research Managers", members: ["Julian Huang", "Rhea Kanuparthi"] },
      { role: "Generalists", members: ["Aarav Leekha", "Gabriel Rosenbaum"] },
    ],
  },
  {
    team: "Events",
    groups: [
      { role: "Team Lead", members: ["Grace Stephens"] },
      { role: "Operations Lead", members: ["Madeleine Hoffman"] },
      { role: "Generalists", members: ["Laura Nielsen", "Daniel Pressman"] },
    ],
  },
  {
    team: "Marketing",
    groups: [
      { role: "Team Lead", members: ["Kailee Kuan"] },
      { role: "Generalists", members: ["Jacqueline Huang", "Victoria Kurakata", "Sophia Wang"] },
    ],
  },
  {
    // Facilitators, grouped by program.
    team: "Facilitators",
    groups: [
      {
        role: "AI Safety Fundamentals",
        members: ["Justin Chen", "Elias England", "Adrian Fang", "Brody Fleishman", "Sasha Haider", "Kerenna Klein", "Laura Nielsen", "Sophia Wang"],
      },
      { role: "AI Policy", members: ["Gil Rubinstein", "Parjanya Tiwari"] },
      { role: "Economics of AI", members: ["Tiago Flora"] },
      { role: "Technical Paper Reading Group", members: ["Lucas Chen", "Brian Yu"] },
    ],
  },
];

// Past organizers (Spring 2026), in the same team format as the current ones.
const pastTeams = [
  {
    team: "Events & Marketing",
    groups: [
      { role: "Team Lead", members: ["Kailee Kuan"] },
      { role: "Operations Leads", members: ["Madeleine Hoffman", "Emma Alcyone"] },
    ],
  },
  {
    team: "Facilitators",
    groups: [
      { role: "AI Safety Fundamentals", members: ["Nicole Tang", "Kin Ching Ip", "Charlie Kunz", "Daniel Pressman"] },
      { role: "AI Policy", members: ["Olle Lange", "Jason Lin", "Steve Zha"] },
      { role: "Economics of AI", members: ["Justin Chen", "Kailee Kuan"] },
    ],
  },
];

const advisors = [
  { memberName: "Nolan Johnson",   memberEmail: "njohnson10@uchicago.edu", bookingUrl: "https://calendly.com/nolanjohnson/chat" },
  { memberName: "Evie Hu",         memberEmail: "evelynhu@uchicago.edu", bookingUrl: "https://calendly.com/eviehu612" },
  { memberName: "Rhea Kanuparthi", memberEmail: "rhea.kanuparthi@gmail.com" },
  { memberName: "Jo Jiao",         memberEmail: "jojiao@uchicago.edu" },
  { memberName: "Zephy Roe",       memberEmail: "zroe@uchicago.edu" },
  { memberName: "Henry Josephson", memberEmail: "henryj@uchicago.edu" },
  { memberName: "Michelle Ma",     memberEmail: "mma02@uchicago.edu" },
  { memberName: "Arden Berg",      memberEmail: "aaberg@uchicago.edu" },
  { memberName: "Avik Garg",       memberEmail: "avikg@uchicago.edu" },
];

function TeamCard({ team, groups }) {
  return (
    <div className={styles.teamCard}>
      <h4 className={styles.teamName}>{team}</h4>
      {groups.map(({ role, members }) => (
        <div key={role || "members"} className={styles.teamGroup}>
          {role && <p className={styles.simpleRole}>{role}</p>}
          <ul className={styles.teamMembers}>
            {members.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

// Teams laid out in columns (each column stacks its cards).
function TeamGrid({ columns }) {
  return (
    <div className={styles.teamGrid}>
      {columns.map((column, i) => (
        <div key={i} className={styles.teamColumn}>
          {column.map((team) => (
            <TeamCard key={team.team} {...team} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function LeadershipSection() {
  return (
    <section id="leadership" className={styles.leadership}>
      <h2 className={styles.sectionTitle}>Leadership</h2>
      <p className={styles.text}>
        If you have any questions, suggestions, or would just like to chat, reach out! We&apos;d
        love to hear from you. Applications for leadership roles are currently closed; look out for
        future opportunities through our{" "}
        <a
          href="https://lists.uchicago.edu/web/info/aisafety"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.inlineLink}>
          mailing list
        </a>
        !
      </p>

      <h3 className={styles.groupTitle}>Executive board</h3>
      <div className={styles.leaderGrid}>
        {executiveBoard.map((member) => (
          <LeadershipMember key={member.memberName} {...member} />
        ))}
      </div>

      <h3 className={styles.groupTitle}>Organizers</h3>
      <TeamGrid columns={[autumnTeams.slice(0, 2), autumnTeams.slice(2, 4), autumnTeams.slice(4)]} />

      <details className={styles.more}>
        <summary className={styles.moreSummary}>Past organizers</summary>
        <div className={styles.moreBody}>
          <TeamGrid columns={[pastTeams.slice(0, 1), pastTeams.slice(1)]} />
        </div>
      </details>

      <details className={styles.more}>
        <summary className={styles.moreSummary}>Advisors</summary>
        <div className={styles.simpleGrid}>
          {advisors.map((member) => (
            <div key={member.memberName} className={styles.simpleCard}>
              <p className={styles.simpleName}>{member.memberName}</p>
              <a href={`mailto:${member.memberEmail}`} className={styles.simpleEmail}>
                <Email address={member.memberEmail} />
              </a>
              {member.bookingUrl && (
                <a
                  href={member.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.simpleBooking}>
                  Book a meeting
                </a>
              )}
            </div>
          ))}
        </div>
      </details>
    </section>
  );
}
