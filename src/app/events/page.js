import React from "react";
import styles from "./page.module.css";
import PageLayout from "@/app/ui/PageLayout";
import EventsCalendar from "./EventsCalendar";
import { GOOGLE_ADD_URL } from "./calendarConfig";
import { getUpcomingEvents, formatEventShort } from "./upcomingEvents";

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
  const upcoming = await getUpcomingEvents();

  return (
    <PageLayout
      title="Events"
      lede={
        <p>
          Check up-to-date events on our{" "}
          <a href={GOOGLE_ADD_URL} target="_blank" rel="noopener noreferrer">
            shared Google Calendar
          </a>
          . New events and changes will be automatically updated.
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
