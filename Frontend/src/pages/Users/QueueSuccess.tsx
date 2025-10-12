// Create: /Frontend/src/pages/Users/BookingConfirmation.tsx
import { useLocation, useNavigate } from 'react-router';
import { Card } from "../../components/Card";
import { getQueueByID } from '../../api/QueueAPI';
import { useEffect, useState } from 'react';

export function BookingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const { booking } = location.state || {};
  const [bookingDetail, setBookingDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  if (!booking) {
    navigate('/users/bookings');
    return null;
  }

  useEffect(() => {
    const fetchQueueDetails = async () => {
      try {
        setLoading(true);
        const queueDetails = await getQueueByID(booking._id);
        setBookingDetail(queueDetails.data || null);
      } catch (error) {
        console.error("Error fetching queue details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQueueDetails();
  }, [booking._id]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col max-w-4xl w-full justify-center items-center mx-auto p-4">
        <Card className="w-full max-w-2xl">
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4">กำลังโหลดข้อมูล...</p>
          </div>
        </Card>
      </div>
    );
  }

  // Show error state if no booking detail
  if (!bookingDetail) {
    return (
      <div className="flex flex-col max-w-4xl w-full justify-center items-center mx-auto p-4">
        <Card className="w-full max-w-2xl">
          <div className="p-6 text-center">
            <p className="text-red-600">ไม่สามารถโหลดข้อมูลคิวได้</p>
            <button 
              className="btn btn-primary mt-4"
              onClick={() => navigate('/users/bookings')}
            >
              กลับหน้าจองคิว
            </button>
          </div>
        </Card>
      </div>
    );
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
              <span className="font-semibold">คิวที่:</span>
              <span className="ml-2 text-2xl font-bold text-blue-600">#{bookingDetail?.queueNumber || 'N/A'}</span>
            </div>
            <div className="border-b pb-2">
              <span className="font-semibold">ชื่อ:</span>
              <span className="ml-2">{bookingDetail?.customerId?.customerName || 'N/A'}</span>
            </div>
            <div className="border-b pb-2">
              <span className="font-semibold">เบอร์โทร:</span>
              <span className="ml-2">{bookingDetail?.customerId?.customerPhone || 'N/A'}</span>
            </div>
            <div className="border-b pb-2">
              <span className="font-semibold">วันที่:</span>
              <span className="ml-2">{bookingDetail?.bookingDate ? new Date(bookingDetail?.bookingDate).toLocaleDateString('th-TH') : 'N/A'}</span>
            </div>
            <div className="border-b pb-2">
              <span className="font-semibold">เวลา:</span>
              <span className="ml-2">{bookingDetail?.timeSlotDetails?.StartTime || 'N/A'}</span>
            </div>
            <div className="border-b pb-2">
              <span className="font-semibold">บริการ:</span>
              <span className="ml-2">{bookingDetail?.serviceTypeDetails?.name || 'N/A'}</span>
            </div>
          </div>
          
          <div className="mt-6 space-y-3">

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