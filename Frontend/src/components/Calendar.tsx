import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import thLocale from "@fullcalendar/core/locales/th";
import type { EventClickArg } from "@fullcalendar/core";
import { useState } from "react";
import { CustomerModal } from "./Modals/CustomerModal";
import { EditBookingModal } from "./Modals/EditBookingModal";
import { updateQueueStatus, getAllQueues, notifyStatusChange } from "../api/QueueAPI";



export interface CalendarEvent {
  _id: string;
  customerId: {
    customerName: string;
    customerPhone: string;
  };
  queueNumber: number;
  serviceType: string;
  serviceTypeDetails:{
    name: string;
  };
  status: string;
  bookingDate: string;
  timeSlot: string;
  timeSlotDetails: {
    startTime: string;
  };
  referenceId: string;
  notes?: string;
}

export interface CalendarProps {
  data: CalendarEvent[];
  onDataUpdate?: (newData: CalendarEvent[]) => void;
}


export function Calendar({data, onDataUpdate}: CalendarProps) {
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    const extendedProps = event.extendedProps;

    const bookingData = {
      _id: event.id,
      queueNumber: extendedProps.queueNumber,
      customerName: extendedProps.customerName,
      customerPhone: extendedProps.customerPhone,
      serviceType: extendedProps.serviceType,
      timeSlotDetails: extendedProps.timeSlotDetails,
      status: extendedProps.status,
      bookingDate: event.start?.toISOString() || '',
      notes: extendedProps.notes || '',
      referenceId: extendedProps.referenceId || ''
    };

    const detailModal = document.getElementById("booking-detail-modal") as HTMLDialogElement;
    if (detailModal) {
      detailModal.showModal();
      const modalContent = detailModal.querySelector(".modal-box");
      if (modalContent) {
        modalContent.innerHTML = `
          <div class="flex justify-between items-center mb-4">
            <h1 class="text-lg font-bold">ชื่อ: ${extendedProps.customerName}</h1>
            <button class="btn btn-sm btn-circle btn-ghost close-btn">✕</button>
          </div>
          
          <div class="space-y-3">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="font-semibold">คิวที่:</p>
                <p class="text-2xl font-bold text-primary">${extendedProps.queueNumber}</p>
              </div>
              <div>
                <p class="font-semibold">หมายเลขอ้างอิง:</p>
                <p class="text-2xl font-bold text-secondary">${extendedProps.referenceId}</p>
              </div>
              <div>
                <p class="font-semibold">สถานะ:</p>
                <span class="badge ${getStatusBadgeClass(extendedProps.status)}">${getStatusText(extendedProps.status)}</span>
              </div>
            </div>
            
            <div class="divider"></div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="font-semibold">บริการ:</p>
                <p>${extendedProps.serviceType.name}</p>
              </div>
              <div>
                <p class="font-semibold">เบอร์โทร:</p>
                <p>${extendedProps.customerPhone || 'N/A'}</p>
              </div>
              <div>
                <p class="font-semibold">วันที่:</p>
                <p>${event.start?.toLocaleDateString('th-TH') || 'N/A'}</p>
              </div>
              <div>
                <p class="font-semibold">เวลา:</p>
                <p>${extendedProps.timeSlotDetails.StartTime} น.</p>
              </div>
            </div>
            
            <div class="modal-action">
              <button class="btn btn-ghost close-btn">ปิด</button>
              <button class="btn btn-primary edit-btn">แก้ไขสถานะ</button>
            </div>
          </div>
        `;
      }


      const closeButtons = detailModal.querySelectorAll(".close-btn");
      closeButtons.forEach(button => {
        button.addEventListener("click", () => {
          detailModal.close();
        });
      });
      

      const editButton = detailModal.querySelector(".edit-btn");
    
      if (editButton) {
        editButton.addEventListener("click", () => {
          detailModal.close();
      
          setSelectedBooking(bookingData);
          setShowEditModal(true);
         
        });
      }
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'waiting': return 'badge-warning';
      case 'in-progress': return 'badge-info';
      case 'completed': return 'badge-success';
      case 'cancelled': return 'badge-error';
      default: return 'badge-ghost';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'waiting': return 'รอคิว';
      case 'in-progress': return 'กำลังให้บริการ';
      case 'completed': return 'เสร็จสิ้น';
      case 'cancelled': return 'ยกเลิก';
      default: return status;
    }
  };

  const handleUpdateBooking = async (updatedData: any) => {
    try {
      console.log('Updating booking with data:', updatedData);
      
      await updateQueueStatus(updatedData._id, {
        status: updatedData.status,
        notes: updatedData.notes,
        completedAt: updatedData.completedAt
      });

      
      
      // Refresh the calendar data
      if (onDataUpdate) {
        const response = await getAllQueues();
        const queuesArray = response.data || response.queues || response || [];
        console.log('New data fetched:', queuesArray);
        onDataUpdate(queuesArray);
      }

      await notifyStatusChange(updatedData._id);
   
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedBooking(null);
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
    title: `คิวที่ ${data.queueNumber} - ${data.customerId?.customerName} (${data.serviceTypeDetails?.name}) RefID:${data.referenceId}`,
    date: data.bookingDate.split('T')[0],
    color: getColorByStatus(data.status),
    extendedProps: {
      queueNumber: data.queueNumber,
      customerName: data.customerId?.customerName,
      customerPhone: data.customerId?.customerPhone,
      serviceType: data.serviceTypeDetails,
      timeSlot: data.timeSlot,
      timeSlotDetails: data.timeSlotDetails,
      status: data.status,
      notes: data.notes || '',
      referenceId: data.referenceId || ''

    }
  }));


  const allEvents = [ ...calendarEvents];

  return (
    <>
    <FullCalendar
      key={data.length} // Force re-render when data changes
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
    
    {/* View Booking Detail Modal */}
    <CustomerModal id="booking-detail-modal">
     <div className="modal-content"></div>
    </CustomerModal>

    {/* Edit Booking Modal */}
    {showEditModal && (
      <EditBookingModal
        id="edit-booking-modal"
        bookingData={selectedBooking}
        onUpdate={handleUpdateBooking}
        onClose={handleCloseEditModal}
      />
    )}
    </>
  );
}
