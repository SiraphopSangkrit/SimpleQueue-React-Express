import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import thLocale from "@fullcalendar/core/locales/th";

export function Calendar() {
  const handleEventClick = (clickInfo: any) => {
    // Handle event click here
    console.log("Event clicked:", clickInfo.event.title);
  };

  // Regular events
  const regularEvents = [
    { title: "event 1", date: "2025-07-02", color: "#3b82f6" },
    { title: "event 2", date: "2025-07-02", color: "#3b82f6" },
  ];

 

  return (
    <FullCalendar
      plugins={[dayGridPlugin, googleCalendarPlugin]}
      initialView="dayGridMonth"
      locale={thLocale}
      eventClick={handleEventClick}
      editable={false}
      eventStartEditable={false}
      eventDurationEditable={false}
      eventClassNames="cursor-pointer"
      weekends={false}
      googleCalendarApiKey={import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY}
      eventSources={[
        { events: regularEvents },
        {
          googleCalendarId: import.meta.env.VITE_GOOGLE_CALENDAR_ID,
          color: '#10b981',
          textColor: 'white'
        }
      ]}
    />
  );
}
