import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import thLocale from "@fullcalendar/core/locales/th";
import type { EventClickArg } from "@fullcalendar/core";
import { CustomerModal } from "./Modals/CustomerModal";

export interface CalendarEvent {
  _id: string;
  queueNumber: number;
  customerId: {
    customerName: string;
    customerPhone: string;
  };
  serviceType: string;
  status: string;
  bookingDate: string;
  timeSlot: string;
}

export interface CalendarProps {
  data: CalendarEvent[];
}


export function Calendar({data}: CalendarProps) {

  const handleEventClick = (clickInfo: EventClickArg) => {

    const event = clickInfo.event;
    const extendedProps = event.extendedProps;


    const modal = document.getElementById("booking-detail-modal") as HTMLDialogElement;
    if (modal) {
      modal.showModal();
      const modalContent = modal.querySelector(".modal-box");
      if (modalContent) {
        modalContent.innerHTML = `
          <h1 class="text-lg font-bold">${extendedProps.customerName}</h1>
          <p>Queue Number: ${extendedProps.queueNumber}</p>
          <p>Service Type: ${extendedProps.serviceType}</p>
           <p>Date: ${event.startStr || event.start?.toDateString() || 'N/A'}</p>
          <p>Time Slot: ${extendedProps.timeSlot}</p>
          <p>Status: ${extendedProps.status}</p>
          
        `;
      }
      const closeButton = modal.querySelector("button");
      if (closeButton) {
        closeButton.onclick = () => {
          modal.close();
        };
      }
    }
  };
  const getColorByStatus = (status: string) => {
    switch (status) {
      case 'waiting': return '#fbbf24'; // yellow
      case 'in-progress': return '#3b82f6'; // blue
      case 'completed': return '#10b981'; // green
      case 'cancelled': return '#ef4444'; // red
      default: return '#6b7280'; // gray
    }
  };

  const calendarEvents = (data || []).map((data) => ({
    id: data._id,
    title: `#${data.queueNumber} - ${data.customerId.customerName}`,
    date: data.bookingDate.split('T')[0],
    color: getColorByStatus(data.status),
    extendedProps: {
      queueNumber: data.queueNumber,
      customerName: data.customerId.customerName,
      serviceType: data.serviceType,
      timeSlot: data.timeSlot,
      status: data.status
    }
  }));


  // Regular events
  

  const allEvents = [ ...calendarEvents];

  return (
    <>
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
        { events: allEvents },
        {
          googleCalendarId: import.meta.env.VITE_GOOGLE_CALENDAR_ID,
          color: '#10b981',
          textColor: 'white'
        }
      ]}
    />
    <CustomerModal id="booking-detail-modal">
     <div className="modal-content"></div>
      </CustomerModal>
    </>
  );
}
