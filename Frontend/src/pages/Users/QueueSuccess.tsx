// Create: /Frontend/src/pages/Users/BookingConfirmation.tsx
import { useLocation, useNavigate } from 'react-router';
import { Card } from "../../components/Card";

export function BookingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking, customer } = location.state || {};

  if (!booking) {
    navigate('/users/bookings');
    return null;
  }
  return (
    <div className="flex flex-col max-w-4xl w-full justify-center items-center mx-auto p-4">
      <Card className="w-full max-w-2xl">
        <div className="p-6 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-green-600 mb-2">จองคิวสำเร็จ!</h1>
            <p className="text-gray-600">ข้อมูลการจองของคุณ</p>
          </div>
          
          <div className="space-y-4 text-left">
            <div className="border-b pb-2">
              <span className="font-semibold">หมายเลขคิว:</span>
              <span className="ml-2 text-2xl font-bold text-blue-600">#{booking.queueNumber}</span>
            </div>
            <div className="border-b pb-2">
              <span className="font-semibold">ชื่อ:</span>
              <span className="ml-2">{customer?.customerName}</span>
            </div>
            <div className="border-b pb-2">
              <span className="font-semibold">เบอร์โทร:</span>
              <span className="ml-2">{customer?.customerPhone}</span>
            </div>
            <div className="border-b pb-2">
              <span className="font-semibold">วันที่:</span>
              <span className="ml-2">{new Date(booking.bookingDate).toLocaleDateString('th-TH')}</span>
            </div>
            <div className="border-b pb-2">
              <span className="font-semibold">เวลา:</span>
              <span className="ml-2">{booking.timeSlot}</span>
            </div>
            <div className="border-b pb-2">
              <span className="font-semibold">บริการ:</span>
              <span className="ml-2">{booking.serviceType}</span>
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            <button 
              className="btn btn-primary w-full"
              onClick={() => navigate('/queue-status', { state: { queueId: booking._id } })}
            >
              ดูสถานะคิว
            </button>
            <button 
              className="btn btn-outline w-full"
              onClick={() => navigate('/users/bookings')}
            >
              จองคิวใหม่
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}