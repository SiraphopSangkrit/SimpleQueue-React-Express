import { useState, useEffect, useRef } from "react";

interface EditBookingModalProps {
  id: string;
  bookingData: any;
  onUpdate: (updatedData: any) => void;
  onClose: () => void;
}

export function EditBookingModal({ id, bookingData, onUpdate, onClose }: EditBookingModalProps) {
  const [status, setStatus] = useState(bookingData?.status || 'waiting');
  const [notes, setNotes] = useState(bookingData?.notes || '');
  const [isLoading, setIsLoading] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (bookingData) {
      setStatus(bookingData.status || 'waiting');
      setNotes(bookingData.notes || '');
    }
  }, [bookingData]);

  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  }, []);

  const statusOptions = [
    { value: 'waiting', label: 'รอคิว', color: 'badge-warning' },
    { value: 'in-progress', label: 'กำลังให้บริการ', color: 'badge-info' },
    { value: 'completed', label: 'เสร็จสิ้น', color: 'badge-success' },
    { value: 'cancelled', label: 'ยกเลิก', color: 'badge-error' }
  ];

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const updatedData = {
        ...bookingData,
        status,
        notes,
        completedAt: status === 'completed' ? new Date().toISOString() : null
      };
      
      await onUpdate(updatedData);
      if (dialogRef.current) {
        dialogRef.current.close();
      }
      onClose();
    } catch (error) {
      console.error('Error updating booking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
    onClose();
  };

  const getCurrentStatusBadge = () => {
    const currentStatus = statusOptions.find(option => option.value === status);
    return currentStatus ? (
      <span className={`badge ${currentStatus.color}`}>
        {currentStatus.label}
      </span>
    ) : null;
  };

  if (!bookingData) return null;

  return (
    <dialog ref={dialogRef} id={id} className="modal">
      <div className="modal-box max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">แก้ไขรายละเอียดการจอง</h3>
          <button 
            className="btn btn-sm btn-circle btn-ghost"
            onClick={handleClose}
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Customer Information (Read Only) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div>
                <label className="label">
                  <span className="label-text font-semibold">ชื่อลูกค้า</span>
                </label>
                <div className="p-2 bg-base-200 rounded">{bookingData.customerName}</div>
              </div>
              
              <div>
                <label className="label">
                  <span className="label-text font-semibold">เบอร์โทร</span>
                </label>
                <div className="p-2 bg-base-200 rounded">{bookingData.customerPhone}</div>
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-semibold">หมายเลขคิว</span>
                </label>
                <div className="p-2 bg-base-200 rounded font-bold text-lg">
                  คิวที่ {bookingData.queueNumber}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <label className="label">
                  <span className="label-text font-semibold">บริการ</span>
                </label>
                <div className="p-2 bg-base-200 rounded">{bookingData.serviceType?.name}</div>
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-semibold">วันที่</span>
                </label>
                <div className="p-2 bg-base-200 rounded">
                  {new Date(bookingData.bookingDate).toLocaleDateString('th-TH')}
                </div>
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-semibold">เวลา</span>
                </label>
                <div className="p-2 bg-base-200 rounded">
                  {bookingData.timeSlotDetails?.StartTime} น.
                </div>
              </div>
            </div>
          </div>

          {/* Editable Fields */}
          <div className="divider">แก้ไขสถานะ</div>

          <div className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text font-semibold">สถานะปัจจุบัน</span>
              </label>
              <div className="flex items-center gap-2 mb-2">
                {getCurrentStatusBadge()}
              </div>
              
              <select 
                className="select select-bordered w-full"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">
                <span className="label-text font-semibold">หมายเหตุ</span>
              </label>
              <textarea
                className="textarea textarea-bordered w-full h-20"
                placeholder="เพิ่มหมายเหตุ (ถ้ามี)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {status === 'completed' && (
              <div className="alert alert-success">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>จะบันทึกเวลาที่เสร็จสิ้นบริการอัตโนมัติ</span>
              </div>
            )}

            {status === 'cancelled' && (
              <div className="alert alert-warning">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span>การจองนี้จะถูกยกเลิก</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="modal-action">
            <button 
              className="btn btn-ghost" 
              onClick={handleClose}
              disabled={isLoading}
            >
              ยกเลิก
            </button>
            <button 
              className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
            </button>
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={handleClose}>close</button>
      </form>
    </dialog>
  );
}