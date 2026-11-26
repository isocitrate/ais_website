/* Decorative SVG logo parts (MATS) are plain <img>s so they can be sized in % like the design. */
/* eslint-disable @next/next/no-img-element */
import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";
import NeuralBackground from "@/app/ornaments/NeuralBackground";
import GradientDescentBackground from "@/app/ornaments/GradientDescentBackground";

// Hero background: "network" (calm neural network) or "descent" (loss-landscape
// contours with a gradient-descent path).
const HERO_BACKGROUND = "descent";
import TimeHorizonChart from "@/app/TimeHorizonChart/TimeHorizonChart";
import { getUpcomingEvents, formatEventShort } from "@/app/events/upcomingEvents";

export const metadata = {
  title: "AI Safety Group @ UChicago XLab",
  description:
    "UChicago's student-led initiative studying AI safety, sponsored by the x-risk lab.",
  keywords:
    "AI safety, AI alignment, University of Chicago, x-risk lab, AI research",
};

// Upcoming events come from the shared Google Calendar.
export const revalidate = 300;

const MAILING_LIST_URL = "https://lists.uchicago.edu/web/info/aisafety";
const SLACK_URL =
  "https://join.slack.com/t/xlab-uchicago/shared_invite/zt-47zdem4lv-vncDwWYv3WTBCHvK8ZgN8Q";

const risks = [
  {
    title: "Misuse",
    description:
      "Malicious actors increasingly have access to powerful models with advanced cyber, bio, and nuclear capabilities.",
  },
  {
    title: "Loss of control",
    description:
      "Powerful AI models could break containment and autonomously inflict damages, as illustrated by the HuggingFace incident.",
  },
  {
    title: "Power concentration",
    description:
      "Groups that control powerful AI might accrue extreme power in society and rob ordinary people of their voices.",
  },
  {
    title: "Cascading risks",
    description:
      "AI is already creating geopolitical tensions and discontent across society. This could create unpredictable ripple-on effects.",
  },
];

const programs = [
  {
    title: ["Intro", "Fellowships"],
    description:
      "Guided weekly discussion groups introducing students to the basics of AI safety. Runs every quarter.",
    href: "/fellowships",
  },
  {
    title: ["Working", "Groups"],
    description: "Quarter-long research projects to tackle an open question in AI safety.",
    href: "/working-groups",
  },
  {
    title: ["Writing", "Room"],
    description: "Focused writing sessions to hone your writing and communication skills.",
    href: "/writing-room",
  },
  {
    title: ["Reading", "Groups"],
    description: "Advanced reading sessions focused on a specific AI safety topic.",
    href: "/fellowships#reading",
  },
];

// Photo strip (scrolls slowly in a loop). Widths/heights are display sizes in
// px at a 1512px-wide page; mix widths and ratios for visual interest. To add a
// photo, put it in public/home/ and add a line here — the loop speed adjusts.
const photos = [
  { src: "/home/event-dinner.jpg", alt: "Students sharing a meal at an AI Safety Group dinner", w: 288, h: 384 },
  { src: "/home/event-pizza.jpg", alt: "Organizers carrying stacks of pizza boxes into an event", w: 469, h: 313 },
  { src: "/home/event-workshop.jpg", alt: "Students around a seminar table during a workshop", w: 472, h: 354 },
  { src: "/home/event-talk.jpg", alt: "Audience listening to a talk in a lecture room", w: 620, h: 465 },
];

// Positions are percentages of the design's 1310 × 268 logo area, so the
// arrangement scales with the page. Sizes in px are the design's box sizes.
const LOGO_AREA = { w: 1310, h: 268 };
const logos = [
  { name: "Anthropic", src: "/home/anthropic.svg", x: 0, y: 10, w: 304, h: 203 },
  { name: "MATS", mats: true, x: 334, y: 88, w: 179, h: 46 },
  { name: "Redwood Research", src: "/redwood.png", x: 585, y: 0, w: 152, h: 152 },
  { name: "Epoch AI", src: "/epoch.png", x: 809, y: 35, w: 316.8, h: 99 },
  { name: "AI Futures Project", src: "/ai_futures_project_logo.jpg", x: 1205, y: 35, w: 105, h: 105 },
  { name: "Google DeepMind", src: "/DeepMind_new_logo.svg.png", x: 21, y: 184, w: 225, h: 52 },
  { name: "OpenAI", src: "/openai.png", x: 327, y: 152, w: 186, h: 116 },
  { name: "Gray Swan", src: "/gray-swan-og-image.png", x: 585, y: 166, w: 152, h: 80 },
  { name: "New York State Assembly", src: "/nys-assembly-seal.png", x: 858, y: 148, w: 116, h: 116 },
];

const pct = (value, total) => `${((value / total) * 100).toFixed(3)}%`;

function MatsLogo() {
  return (
    <span className={styles.mats}>
      <span className={styles.matsIcon}>
        <img src="/home/mats-icon.svg" alt="" width="46.2362" height="46" />
      </span>
      <img src="/home/mats-text.svg" alt="" width="121.772" height="32.1923" className={styles.matsText} />
    </span>
  );
}

export default async function Home() {
  const events = (await getUpcomingEvents()).slice(0, 3);

  // Hero notice (pulsing dot + label + link, above the hero buttons). Defaults to
  // the next calendar event; to announce something else (e.g. "Applications open"),
  // replace this with { label, title, href }. Set to null to hide it.
  const heroNotice = events[0]
    ? { label: "Next event", title: events[0].name, href: events[0].href || "/events" }
    : null;
  const noticeIsExternal = heroNotice?.href.startsWith("http");

  return (
    <>
      <section className={styles.hero}>
        {HERO_BACKGROUND === "descent" ? <GradientDescentBackground /> : <NeuralBackground />}
        <div className={`${styles.container} ${styles.heroInner}`}>
          {/* Lockup and tagline share one column width, so the logo is exactly as wide as the text. */}
          <div className={styles.heroText}>
            <h1 className={styles.heroBrand}>
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
            </h1>
            <p className={styles.heroLede}>
              We work to reduce risks from advanced AI and ensure its development is in the
              interest of humanity.
            </p>
          </div>
          <div className={styles.heroButtons}>
            {heroNotice && (
              <a
                href={heroNotice.href}
                {...(noticeIsExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                data-arrow="none"
                className={styles.heroEvent}>
                <span className={styles.heroEventLabel}>
                  <span className="nowMark" aria-hidden="true" />
                  {heroNotice.label}
                </span>
                <span className={`${styles.heroEventName} ${noticeIsExternal ? "externalArrow" : ""}`}>
                  {heroNotice.title}
                </span>
              </a>
            )}
            {/* The one main action: the mailing list (maroon = take part). "Get involved"
                lives in the menu; scrolling covers "learn more". */}
            <a
              href={MAILING_LIST_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.heroButton} ${styles.heroButtonPrimary}`}>
              Join our mailing list
            </a>
          </div>
        </div>
      </section>

      <section className={`${styles.container} ${styles.trajectory}`}>
        <h2 className={styles.heading}>Transformative AI could arrive soon...</h2>
        <p className={`${styles.body} ${styles.trajectoryBody}`}>
          AI capabilities are rising quickly. In a few years, AI models went from failing SAT tests
          to making unprecedented math breakthroughs. AI labs may be able to automate AI research,
          putting the world on a path to superintelligence.
        </p>
        <TimeHorizonChart />
      </section>

      <section className={`${styles.container} ${styles.risks}`}>
        <h2 className={styles.heading}>...but the world is not prepared for its risks</h2>
        <div className={styles.riskGrid}>
          {risks.map((risk) => (
            <div key={risk.title}>
              <h3 className={styles.riskTitle}>{risk.title}</h3>
              <p className={styles.small}>{risk.description}</p>
            </div>
          ))}
        </div>
        <div className={styles.sectionLinkRow}>
          {/* TODO: point to the Resources page (arguments + supporting readings) once it exists. */}
          <Link href="/ai-safety-fundamentals" className={styles.sectionLink}>
            More on AI safety
          </Link>
        </div>
      </section>

      <div className={styles.globeWrap}>
        <Image src="/home/earth.png" alt="" aria-hidden="true" width={561} height={561} className={`${styles.globe} dark-invert`} />

        <section className={`${styles.container} ${styles.programs}`}>
          <h2 className={`${styles.heading} ${styles.wideHeading}`}>
            We help UChicago students gain the skills needed to make AI go well
          </h2>
          <p className={`${styles.body} ${styles.programsBody}`}>
            Our programs span technical research, policy, economics, and strategy — all areas where
            students can contribute.
          </p>
          <div className={styles.programGrid}>
            {programs.map((program) => (
              <div key={program.href + program.title[0]} className={styles.programCard}>
                <h3 className={styles.programTitle}>
                  <Link href={program.href}>
                    {program.title.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </Link>
                </h3>
                <p className={styles.small}>{program.description}</p>
              </div>
            ))}
          </div>
          <div className={styles.sectionLinkRow}>
            <Link href="/get-involved" className={styles.sectionLink}>
              Apply to our programs
            </Link>
          </div>
        </section>

        <section id="events" className={`${styles.container} ${styles.events}`}>
          <h2 className={styles.heading}>Upcoming events</h2>
          {events.length > 0 ? (
            <ul className={styles.eventList}>
              {events.map((event) => (
                <li key={`${event.name}-${event.start.getTime()}`}>
                  <a
                    href={event.href || "/events"}
                    {...(event.href ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className={styles.eventLink}>
                    <span className={styles.eventName}>{event.name}</span>
                  </a>
                  <p className={styles.eventMeta}>{formatEventShort(event)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className={`${styles.small} ${styles.eventsEmpty}`}>
              No upcoming events are scheduled right now — check back soon.
            </p>
          )}
          <div className={styles.sectionLinkRow}>
            <Link href="/events" className={styles.sectionLink}>
              Browse all events
            </Link>
          </div>
        </section>

        {/* Three copies of the strip; the track slides left by one copy and loops
            seamlessly. Copies 2–3 are hidden from screen readers. Pauses on hover. */}
        <div className={styles.photos}>
          <div className={styles.photoTrack} style={{ "--count": photos.length }}>
            {[0, 1, 2].map((copy) =>
              photos.map((photo) => (
                <Image
                  key={`${copy}-${photo.src}`}
                  src={photo.src}
                  alt={copy === 0 ? photo.alt : ""}
                  aria-hidden={copy === 0 ? undefined : true}
                  width={photo.w * 2}
                  height={photo.h * 2}
                  sizes={`(max-width: 700px) ${Math.round((photo.w / 700) * 100)}vw, ${Math.round((photo.w / 1512) * 100)}vw`}
                  className={styles.photo}
                  style={{ "--w": photo.w }}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <section className={`${styles.container} ${styles.orgs}`}>
        <h2 className={`${styles.heading} ${styles.orgsHeading}`}>
          Our students go on to work with leading AI safety organizations
        </h2>
        <ul className={`${styles.logos} dark-invert-hue`} style={{ aspectRatio: `${LOGO_AREA.w} / ${LOGO_AREA.h}` }}>
          {logos.map((logo) => (
            <li
              key={logo.name}
              className={styles.logo}
              style={{
                "--x": pct(logo.x, LOGO_AREA.w),
                "--y": pct(logo.y, LOGO_AREA.h),
                "--w": pct(logo.w, LOGO_AREA.w),
                "--h": pct(logo.h, LOGO_AREA.h),
                "--ar": `${logo.w} / ${logo.h}`,
              }}>
              {logo.mats ? (
                <MatsLogo />
              ) : (
                <Image src={logo.src} alt="" fill sizes="(max-width: 700px) 40vw, 20vw" className={styles.logoImage} />
              )}
              <span className={styles.srOnly}>{logo.name}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.getInvolved}>
        {/* Bookend to the hero: the same landscape, tone-on-tone, no ball. */}
        <GradientDescentBackground interactive={false} tone="maroon" fade="left" />
        <div className={`${styles.container} ${styles.getInvolvedInner}`}>
          <h2 className={styles.getInvolvedTitle}>Get involved and help make AI go well.</h2>
          <p className={styles.getInvolvedBody}>
            Concerned about AI? We’d love to stay in touch and see you at our{" "}
            <Link href="/events">upcoming events</Link>. Feel free to reach out with any questions
            or have a quick chat with our student organizers.
          </p>
          <ul className={styles.getInvolvedLinks}>
            <li>
              <a href={MAILING_LIST_URL} target="_blank" rel="noopener noreferrer">
                <span>Sign up to our mailing list</span>
              </a>
            </li>
            <li>
              <a href={SLACK_URL} target="_blank" rel="noopener noreferrer">
                <span>Join our Slack</span>
              </a>
            </li>
            <li>
              <Link href="/about-us#leadership">
                <span>Meet with a student organizer</span>
              </Link>
            </li>
            <li>
              {/* TODO: no group email address exists in the site yet; the leadership page lists organizers' emails. */}
              <Link href="/about-us#leadership">
                <span>Email us</span>
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
