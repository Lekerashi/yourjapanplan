/**
 * Generate an .ics calendar file from itinerary data.
 * Each activity becomes a calendar event.
 */

interface ICalActivity {
  time: string; // "HH:MM"
  title: string;
  description: string;
  duration_minutes: number;
  location: string;
}

interface ICalDay {
  date: string; // "YYYY-MM-DD"
  destination_name: string;
  activities: ICalActivity[];
  transport?: {
    from: string;
    to: string;
    method: string;
    duration: string;
  } | null;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function toICalDate(dateStr: string, time: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const [h, min] = time.split(":").map(Number);
  return `${y}${pad(m)}${pad(d)}T${pad(h)}${pad(min)}00`;
}

function addMinutes(dateStr: string, time: string, minutes: number): string {
  const date = new Date(`${dateStr}T${time}:00`);
  date.setMinutes(date.getMinutes() + minutes);
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const h = pad(date.getHours());
  const min = pad(date.getMinutes());
  return `${y}${m}${d}T${h}${min}00`;
}

function escapeIcal(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export function generateICS(days: ICalDay[], title: string): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Your Japan Plan//EN",
    `X-WR-CALNAME:${escapeIcal(title)}`,
    "CALSCALE:GREGORIAN",
  ];

  let uid = 0;

  for (const day of days) {
    for (const activity of day.activities) {
      uid++;
      const dtStart = toICalDate(day.date, activity.time);
      const dtEnd = addMinutes(day.date, activity.time, activity.duration_minutes);
      lines.push(
        "BEGIN:VEVENT",
        `UID:yjp-${uid}@yourjapanplan.com`,
        `DTSTART:${dtStart}`,
        `DTEND:${dtEnd}`,
        `SUMMARY:${escapeIcal(activity.title)}`,
        `DESCRIPTION:${escapeIcal(activity.description)}`,
        `LOCATION:${escapeIcal(activity.location)}`,
        "END:VEVENT"
      );
    }

    // Add transport leg as event
    if (day.transport) {
      uid++;
      // Place transport at 18:00 as a default (end of day travel)
      const dtStart = toICalDate(day.date, "18:00");
      const dtEnd = addMinutes(day.date, "18:00", 180); // 3hr placeholder
      lines.push(
        "BEGIN:VEVENT",
        `UID:yjp-transport-${uid}@yourjapanplan.com`,
        `DTSTART:${dtStart}`,
        `DTEND:${dtEnd}`,
        `SUMMARY:${escapeIcal(`${day.transport.method}: ${day.transport.from} → ${day.transport.to}`)}`,
        `DESCRIPTION:${escapeIcal(`Travel via ${day.transport.method} (${day.transport.duration})`)}`,
        "END:VEVENT"
      );
    }
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

export function downloadICS(icsContent: string, filename: string) {
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
