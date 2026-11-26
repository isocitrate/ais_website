import { ICAL_URL, CALENDAR_TIME_ZONE } from "./calendarConfig";

// Upcoming one-off events from the shared Google Calendar's public iCal feed.
// Used by the Events page (nearest event) and the homepage (next few events).
// Recurring events and office hours / coworking sessions are left out.

export const EVENTS_REVALIDATE_SECONDS = 300;

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

// Returns { date, allDay } or null. Timed events come from Google as UTC
// ("...Z"); all-day events as VALUE=DATE ("YYYYMMDD"), which we pin to noon UTC
// so the calendar day is the same whatever time zone the server runs in.
function parseIcsDate(value, params = "") {
  if (!value) return null;
  const allDay = /VALUE=DATE(?!-)/.test(params) || /^\d{8}$/.test(value);
  if (allDay) {
    const m = value.match(/^(\d{4})(\d{2})(\d{2})$/);
    return m ? { date: new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], 12)), allDay: true } : null;
  }
  const m = value.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})?(Z)?$/);
  if (!m) return null;
  const [, y, mo, d, h, mi, s = "0", utc] = m;
  if (utc) return { date: new Date(Date.UTC(+y, +mo - 1, +d, +h, +mi, +s)), allDay: false };
  // Floating / TZID time: treat as wall-clock time in the calendar's zone.
  const tz = (params.match(/TZID=([^;:]+)/) || [])[1] || CALENDAR_TIME_ZONE;
  return { date: zonedWallTimeToDate(+y, +mo - 1, +d, +h, +mi, +s, tz), allDay: false };
}

function zonedWallTimeToDate(y, mo, d, h, mi, s, timeZone) {
  const guess = Date.UTC(y, mo, d, h, mi, s);
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    })
      .formatToParts(new Date(guess))
      .map((p) => [p.type, p.value])
  );
  const asZoned = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);
  return new Date(guess - (asZoned - guess));
}

function fmt(date, allDay, options) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: allDay ? "UTC" : CALENDAR_TIME_ZONE,
    ...options,
  }).format(date);
}

// Event date line, from the homepage design: "7pm, Thu 12 Nov @ MCP 201" / "7.30pm, Fri 4 Dec".
export function formatEventShort(event) {
  const { start, end, allDay, location } = event;
  const day = (date, isAllDay) =>
    `${fmt(date, isAllDay, { weekday: "short" })} ${fmt(date, isAllDay, { day: "numeric" })} ${fmt(date, isAllDay, { month: "short" })}`;
  let text;
  if (allDay) {
    text = day(start, true);
    if (end) {
      const lastDay = new Date(end.getTime() - 86400000);
      if (lastDay.getTime() > start.getTime()) text += ` – ${day(lastDay, true)}`;
    }
  } else {
    const t = Object.fromEntries(
      new Intl.DateTimeFormat("en-US", {
        timeZone: CALENDAR_TIME_ZONE,
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
        .formatToParts(start)
        .map((p) => [p.type, p.value])
    );
    const minutes = t.minute === "00" ? "" : `.${t.minute}`;
    text = `${t.hour}${minutes}${t.dayPeriod.toLowerCase()}, ${day(start, false)}`;
  }
  return location ? `${text} @ ${location}` : text;
}

export async function getUpcomingEvents() {
  try {
    const response = await fetch(ICAL_URL, { next: { revalidate: EVENTS_REVALIDATE_SECONDS } });
    if (!response.ok) return [];

    const ics = unfoldIcs(await response.text());
    const now = Date.now();
    const events = [];

    for (const block of ics.split("BEGIN:VEVENT").slice(1)) {
      const fields = {};
      const params = {};
      for (const line of block.split(/\r?\n/)) {
        const separator = line.indexOf(":");
        if (separator < 0) continue;
        const [key, ...rest] = line.slice(0, separator).split(";");
        fields[key] = line.slice(separator + 1);
        params[key] = rest.join(";");
      }

      const title = decodeIcsText(fields.SUMMARY);
      const description = decodeIcsText(fields.DESCRIPTION);
      const location = decodeIcsText(fields.LOCATION);
      const start = parseIcsDate(fields.DTSTART, params.DTSTART);
      const end = parseIcsDate(fields.DTEND, params.DTEND);
      if (!title || !start || start.date.getTime() < now) continue;

      const excludedText = `${title} ${description}`.toLowerCase();
      if (fields.RRULE || /\b(office hours?|coworking|co-working|weekly|recurring)\b/i.test(excludedText)) continue;

      const links = [...description.matchAll(/https?:\/\/[^"'<>\s]+/g)].map((m) => m[0].replace(/[)>.,]+$/, ""));
      const href = links.find((link) => link.includes("luma.com")) || links[0];

      events.push({
        name: title,
        location,
        start: start.date,
        end: end?.date ?? null,
        allDay: start.allDay,
        description:
          description
            .replace(/<[^>]*>/g, " ")
            .replace(/&nbsp;/g, " ")
            .replace(/&amp;/g, "&")
            .replace(/\s+/g, " ")
            .trim() || "Details for this event are available in the shared calendar.",
        descriptionHtml: description.replace(/<a\b([^>]*)>/gi, '<a$1 target="_blank" rel="noopener noreferrer">'),
        href,
      });
    }

    return events.sort((a, b) => a.start - b.start);
  } catch (error) {
    console.error("Unable to load upcoming events:", error);
    return [];
  }
}
