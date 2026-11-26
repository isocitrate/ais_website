// Shared "AI Safety Group Calendar" in Google Calendar. It must stay public
// ("Make available to public") for the embedded calendar to show events.
export const CALENDAR_ID =
  "c_71affa9d6e2baa9d301ea12f61df9c022a70abcd6d60f74327613c4145eb9d2f@group.calendar.google.com";

export const CALENDAR_TIME_ZONE = "America/Chicago";

// Opens Google Calendar with a prompt to add the shared calendar.
export const GOOGLE_ADD_URL =
  "https://calendar.google.com/calendar/u/0?cid=Y183MWFmZmE5ZDZlMmJhYTlkMzAxZWExMmY2MWRmOWMwMjJhNzBhYmNkNmQ2MGY3NDMyNzYxM2M0MTQ1ZWI5ZDJmQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20";

// Embed styled to sit quietly on the page: no title/print/tabs/calendar list/
// time zone chrome, paper background, events in the site's maroon. Google can't
// read our CSS, so these mirror --paper and --accent in globals.css.
export const EMBED_URL = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(
  CALENDAR_ID
)}&ctz=${encodeURIComponent(CALENDAR_TIME_ZONE)}&mode=MONTH&showTitle=0&showPrint=0&showTabs=0&showCalendars=0&showTz=0&bgcolor=${encodeURIComponent(
  "#fbfaf8"
)}&color=${encodeURIComponent("#900000")}`;

export const ICAL_URL = `https://calendar.google.com/calendar/ical/${encodeURIComponent(
  CALENDAR_ID
)}/public/basic.ics`;
