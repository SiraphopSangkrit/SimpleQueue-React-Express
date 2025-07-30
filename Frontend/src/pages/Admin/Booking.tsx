import { Calendar } from "../../components/Calendar";
import type { CalendarEvent } from "../../components/Calendar";
import { BookingModal } from "../../components/Modals/BookingModal";
import Datepicker from "react-tailwindcss-datepicker";
import { useEffect, useState } from "react";
import { getAllQueues } from "../../api/QueueAPI";
import { Input } from "../../components/Inputs/Input";
import { BoxSelect } from "../../components/BoxSelect";


export function Booking() {
  const [value, setValue] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });
  const [data, setData] = useState<CalendarEvent[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [tel, setTel] = useState<string>('');
  const resetForm = () => {
    setValue({ startDate: null, endDate: null });
    setSelectedTime('');
    
  };

  useEffect(() => {
    const modal = document.getElementById("modal-booking") as HTMLDialogElement;
   
    getAllQueues().then((response) => {
     
      const queuesArray = response.data || response.queues || response || [];
      setData(queuesArray);
      console.log("Queues fetched successfully:", queuesArray);
    }).catch((error) => {
      console.error("Error fetching queues:", error);
      setData([]); // Set empty array on error
    });
      
    

    
    const handleClose = () => {
      resetForm();
    };
    
    if (modal) {
      modal.addEventListener('close', handleClose);
      return () => modal.removeEventListener('close', handleClose);
    }

  
  }, []);

  
  return (
    <div className="flex flex-col items-center justify-center ">
      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-bold mb-4">Booking</h1>
        <button
          className="btn"
          onClick={() =>
            (
              document.getElementById("modal-booking") as HTMLDialogElement
            )?.showModal()
          }
        >
          open modal
        </button>
      </div>
      <div className="w-full ">
        <Calendar  data={data}/>
      </div>
      <BookingModal id="modal-booking">
        <h3 className="font-bold text-lg">Booking</h3>
        <p className="py-4">Select a date for your booking:</p>
        <div className="flex items-center gap-4 mb-4">
          <Input
            boxClassName="flex-2"
            label="ชื่อ-นามสกุล"
           value={name}
            onChange={(value) => setName(value)}
            placeholder="ชื่อ-นามสกุล"
            type="text"
            name="name"
          />
          <Input
            boxClassName="flex-1"
            label="เบอร์โทร"
            value={tel}
            onChange={(value) => setTel(value)}
            placeholder="เบอร์โทร"
            type="text"
            name="tel"
          />
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              วันที่จอง
            </label>
            <Datepicker
              displayFormat="DD/MM/YYYY"
              i18n={"th"}
              useRange={false}
              asSingle={true}
              value={value}
              onChange={(newValue) => {
                if (newValue) {
                  setValue(
                    newValue as { startDate: Date | null; endDate: Date | null }
                  );
                }
              }}
              inputClassName="input w-full"
            />
          </div>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              เวลาที่จอง
            </label>
            <fieldset className="space-y-6">
            <div className="grid sm:grid-cols-4 gap-2">
             <BoxSelect 
              id="1" 
              startTime="9.00" 
              endTime="10.00" 
              name="time-picker"
              checked={selectedTime === '1'}
              onChange={setSelectedTime}
            />
            <BoxSelect 
              id="2" 
              startTime="10.00" 
              endTime="11.00" 
              name="time-picker"
              checked={selectedTime === '2'}
              onChange={setSelectedTime}
            />
            <BoxSelect 
              id="3" 
              startTime="11.00" 
              endTime="12.00" 
              name="time-picker"
              checked={selectedTime === '3'}
              onChange={setSelectedTime}
            />
            <BoxSelect 
              id="4" 
              startTime="01.00" 
              endTime="02.00" 
              name="time-picker"
              checked={selectedTime === '4'}
              onChange={setSelectedTime}
            />

            </div>
            </fieldset>
          </div>
        </div>
        <div className="modal-action">
          <button className="btn btn-primary">Confirm Booking</button>
       
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </BookingModal>
    </div>
  );
}
