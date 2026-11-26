import React from "react";
import styles from "./page.module.css";
import PageLayout from "@/app/ui/PageLayout";
import EventsCalendar from "./EventsCalendar";
import { GOOGLE_ADD_URL } from "./calendarConfig";
import { getUpcomingEvents, getPastEvents, formatEventShort, formatEventDay } from "./upcomingEvents";

export const metadata = {
  title: "Events - AI Safety Group @ UChicago XLab",
  description: "Upcoming and past events from the AI Safety Group @ UChicago XLab.",
  keywords: "AI safety, events, University of Chicago, symposium",
};

// Same treatment as the homepage's event list: underlined title with ↗, then
// "6pm, Mon 30 Nov @ ERC401", then the calendar description.
function EventRow({ event, isNext = false }) {
  return (
    <article className={styles.eventRow}>
      <h3 className={styles.eventName}>
        {isNext && <span className="nowMark" aria-hidden="true" />}
        {event.href ? (
          <a href={event.href} target="_blank" rel="noopener noreferrer" className={styles.eventLink}>
            <span>{event.name}</span>
          </a>
        ) : (
          event.name
        )}
      </h3>
      <p className={styles.eventMeta}>{formatEventShort(event)}</p>
      {event.descriptionHtml ? (
        <div
          className={styles.eventDescription}
          dangerouslySetInnerHTML={{ __html: event.descriptionHtml }}
        />
      ) : (
        <p className={styles.eventDescription}>{event.description}</p>
      )}
    </article>
  );
}

export default async function Events() {
  const [upcoming, past] = await Promise.all([getUpcomingEvents(), getPastEvents()]);

  return (
    <PageLayout
      title="Events"
      lede={
        <p>
          We host speaker events, workshops, and discussions around AI safety. We also run regular
          office hours where anyone can come talk to our student team. Subscribe to our{" "}
          <a href={GOOGLE_ADD_URL} target="_blank" rel="noopener noreferrer">
            Google Calendar
          </a>{" "}
          to keep up to date.
        </p>
      }>
      {/* Upcoming first: what most visitors came for. The full calendar follows. */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Upcoming</h2>
        {upcoming.length ? (
          <div className={styles.eventList}>
            {upcoming.map((event, i) => (
              <EventRow key={`${event.name}-${event.start.getTime()}`} event={event} isNext={i === 0} />
            ))}
          </div>
        ) : (
          <p className={styles.text}>No upcoming events are scheduled right now — check back soon.</p>
        )}

        {/* Past events fold right under the upcoming ones. */}
        {past.length > 0 && (
          <details className={styles.fold}>
            <summary className={styles.foldSummary}>Past events</summary>
            <ul className={`${styles.foldBody} ${styles.pastList}`}>
              {past.map((event) => (
                <li key={`${event.name}-${event.start.getTime()}`} className={styles.pastItem}>
                  {event.href ? (
                    <a href={event.href} target="_blank" rel="noopener noreferrer" className={styles.pastName}>
                      {event.name}
                    </a>
                  ) : (
                    <span className={styles.pastName}>{event.name}</span>
                  )}
                  <span className={styles.pastMeta}>
                    {[formatEventDay(event), event.location].filter(Boolean).join(" · ")}
                  </span>
                </li>
              ))}
            </ul>
          </details>
        )}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Calendar</h2>
          <a href={GOOGLE_ADD_URL} target="_blank" rel="noopener noreferrer" className={styles.addLink}>
            Add to Google Calendar
          </a>
        </div>
        <EventsCalendar />
      </section>
    </PageLayout>
  );
}

export const revalidate = 300;
