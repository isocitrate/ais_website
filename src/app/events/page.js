import React from "react";
import Image from "next/image";
import styles from "./page.module.css";
import NeuralBackground from "@/app/ornaments/NeuralBackground";
import EventsCalendar from "./EventsCalendar";
import { GOOGLE_ADD_URL, ICAL_URL } from "./calendarConfig";

export const metadata = {
  title: "Events - AI Safety Group @ UChicago XLab",
  description: "Upcoming and past events from the AI Safety Group @ UChicago XLab.",
  keywords: "AI safety, events, University of Chicago, symposium",
};

function EventRow({ event }) {
  return (
    <div className={styles.eventRow}>
      <p className={styles.eventDate}>{event.date}</p>
      <div className={styles.eventBody}>
        <h3 className={styles.eventName}>{event.name}</h3>
        {event.location && <p className={styles.eventLocation}>{event.location}</p>}
        {event.descriptionHtml ? (
          <div
            className={styles.eventDescription}
            dangerouslySetInnerHTML={{ __html: event.descriptionHtml }}
          />
        ) : (
          <p className={styles.eventDescription}>{event.description}</p>
        )}
        {event.image && (
          <a
            href={event.image.src}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.eventImageLink}>
            <Image
              src={event.image.src}
              alt={event.image.alt}
              width={event.image.width}
              height={event.image.height}
              className={styles.eventImage}
            />
          </a>
        )}
        {event.registerHref && (
          <a
            href={event.registerHref}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.registerLink}>
            Register <span aria-hidden="true">→</span>
          </a>
        )}
        {event.href && (
          <a
            href={event.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.learnMoreLink}>
            Learn more <span aria-hidden="true">→</span>
          </a>
        )}
      </div>
    </div>
  );
}

export default async function Events() {
  const nearestUpcomingEvent = await getNearestUpcomingEvent();

  return (
    <div className={styles.pageWrap}>
      <NeuralBackground transparent clearWidth={860} />
      <div className={styles.eventsContainer}>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Events</h1>
          <p className={styles.pageLede}>
            Check up-to-date events on our{" "}
            <a
              href={GOOGLE_ADD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.inlineLink}>
              shared Google Calendar
            </a>
            . New events and changes will be automatically updated.
          </p>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Calendar</h2>
          <EventsCalendar />
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Upcoming</h2>
          {nearestUpcomingEvent ? (
            <EventRow key={nearestUpcomingEvent.name} event={nearestUpcomingEvent} />
          ) : (
            <p className={styles.eventDescription}>No upcoming special event is currently scheduled.</p>
          )}
        </section>
      </div>
    </div>
  );
}

export const revalidate = 300;

function unfoldIcs(value) {
  return value.replace(/\r\n[ \t]/g, "");
}

function decodeIcsText(value = "") {
  return value
    .replace(/\\n/gi, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\")
    .trim();
}

function parseIcsDate(value) {
  if (!value) return null;
  const cleaned = value.replace(/^;[^:]*:/, "").replace(/^.*:/, "");
  if (/^\d{8}T/.test(cleaned)) {
    const match = cleaned.match(/^([0-9]{4})([0-9]{2})([0-9]{2})T([0-9]{2})([0-9]{2})([0-9]{2})?Z?$/);
    if (!match) return null;
    const [, year, month, day, hour, minute, second = "0"] = match;
    const utc = cleaned.endsWith("Z");
    return utc
      ? new Date(Date.UTC(+year, +month - 1, +day, +hour, +minute, +second))
      : new Date(+year, +month - 1, +day, +hour, +minute, +second);
  }
  const match = cleaned.match(/^([0-9]{4})([0-9]{2})([0-9]{2})$/);
  return match ? new Date(+match[1], +match[2] - 1, +match[3]) : null;
}

function formatEventDate(start, end) {
  if (!start) return "Date to be announced";
  const startDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(start);
  const allDay = start.getHours() === 0 && start.getMinutes() === 0;
  if (allDay) {
    if (end && end.getTime() > start.getTime()) {
      const endDate = new Date(end.getTime() - 86400000);
      if (endDate.toDateString() !== start.toDateString()) {
        return `${startDate} – ${new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(endDate)}`;
      }
    }
    return startDate;
  }
  const time = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(start);
  return time;
}

async function getNearestUpcomingEvent() {
  try {
    const response = await fetch(ICAL_URL, {
      next: { revalidate: 300 },
    });
    if (!response.ok) return null;

    const ics = unfoldIcs(await response.text());
    const now = Date.now();
    const events = [];

    for (const block of ics.split("BEGIN:VEVENT").slice(1)) {
      const lines = block.split(/\r?\n/);
      const fields = {};
      for (const line of lines) {
        const separator = line.indexOf(":");
        if (separator < 0) continue;
        const key = line.slice(0, separator).split(";")[0];
        fields[key] = line.slice(separator + 1);
      }

      const title = decodeIcsText(fields.SUMMARY);
      const description = decodeIcsText(fields.DESCRIPTION);
      const location = decodeIcsText(fields.LOCATION);
      const start = parseIcsDate(fields.DTSTART);
      const end = parseIcsDate(fields.DTEND);
      if (!title || !start || start.getTime() < now) continue;

      const excludedText = `${title} ${description}`.toLowerCase();
      if (
        fields.RRULE ||
        /\b(office hours?|coworking|co-working|weekly|recurring)\b/i.test(excludedText)
      ) continue;

      const calendarLinks = [...description.matchAll(/https?:\/\/[^\"'<>\s]+/g)]
        .map((match) => match[0].replace(/[)>.,]+$/, ""));
      const href = calendarLinks.find((link) => link.includes("luma.com")) || calendarLinks[0];
      const descriptionHtml = description
        .replace(/<a\b([^>]*)>/gi, '<a$1 target="_blank" rel="noopener noreferrer">');
      events.push({
        name: title,
        date: formatEventDate(start, end),
        location,
        description: description.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim()
          || "Details for this event are available in the shared calendar.",
        descriptionHtml,
        href,
        startMs: start.getTime(),
      });
    }

    events.sort((a, b) => a.startMs - b.startMs);
    return events[0] || null;
  } catch (error) {
    console.error("Unable to load upcoming event:", error);
    return null;
  }
}
