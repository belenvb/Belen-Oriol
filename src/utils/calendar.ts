export interface CalendarEventParams {
  title: string;
  description: string;
  location: string;
  startTime: string; // YYYYMMDDTHHmmss
  endTime: string;
}

export function generateGoogleCalendarUrl(params: CalendarEventParams): string {
  const base = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  const query = new URLSearchParams({
    text: params.title,
    details: params.description,
    location: params.location,
    dates: `${params.startTime}/${params.endTime}`,
  });
  return `${base}&${query.toString()}`;
}

export function downloadIcsFile(params: CalendarEventParams, filename = 'boda-belen-y-oriol.ics') {
  const icsData = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Belen y Oriol Boda 2027//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `SUMMARY:${params.title.replace(/,/g, '\\,')}`,
    `DESCRIPTION:${params.description.replace(/,/g, '\\,')}`,
    `LOCATION:${params.location.replace(/,/g, '\\,')}`,
    `DTSTART:${params.startTime}`,
    `DTEND:${params.endTime}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
