import { Card } from "../../components/Card";
import { Input } from "../../components/Inputs/Input";
import  Datepicker from "react-tailwindcss-datepicker";
import { useState,useEffect, use } from "react";
import { BoxSelect } from "../../components/BoxSelect";
import { Label } from "../../components/Inputs/Label";

export function UserBooking() {
    const [value, setValue] = useState<{
        startDate: Date | null;
        endDate: Date | null;
      }>({
        startDate: null,
        endDate: null,
      });
      
      const [selectedTime, setSelectedTime] = useState<string>('');
      const [name, setName] = useState<string>('');
      const [tel, setTel] = useState<string>('');
      const resetForm = () => {
        setValue({ startDate: null, endDate: null });
        setSelectedTime('');
      };
      const handleClose = () => {
        resetForm();
      };

  return (
    <div className="flex flex-col max-w-4xl w-full justify-center items-center mx-auto p-4">
      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-bold mb-4">User Bookings</h1>
      </div>
      <div className="max-w-3xl mx-auto">
        <Card className="w-full">
          <div className="p-4"></div>
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
           <Label label="วันที่จอง"/>
         
          
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
              inputClassName="input w-full text-gray-700 dark:text-gray-300 bg-base-200   border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-full">
            <Label label="เวลาที่จอง" />
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
       
            <button className="btn" onClick={handleClose}>Clear</button>
        
        </div>
        </Card>
      </div>
    </div>
  );
}
