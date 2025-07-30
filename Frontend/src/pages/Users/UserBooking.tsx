import { Card } from "../../components/Card";
import { Input } from "../../components/Inputs/Input";
import Datepicker from "react-tailwindcss-datepicker";
import { useState,useEffect } from "react";
import { BoxSelect } from "../../components/BoxSelect";
import { Label } from "../../components/Inputs/Label";
import { createQueue } from "../../api/QueueAPI";
import { useNavigate } from "react-router";
import { getServiceTypes } from "../../api/SettingsAPI";
import Select from 'react-select'

export function UserBooking() {
  const navigate = useNavigate();
  const [value, setValue] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });

  const [selectedTime, setSelectedTime] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [tel, setTel] = useState<string>("");
  const [serviceTypeList, setServiceTypeList] = useState<any[]>([]);
  const [serviceType, setServiceType] = useState<any>(null);
  // const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setValue({ startDate: null, endDate: null });
    setSelectedTime("");
    setName("");
    setTel("");
    setServiceType(null);
  };
  const handleClose = () => {
    resetForm();
  };

useEffect(() => {
  getServiceTypes().then((response) => {
    const serviceTypesArray = response.data || response.serviceTypes || response || [];
    setServiceTypeList(serviceTypesArray);
    console.log("Service types fetched successfully:", serviceTypesArray);
  }).catch((error) => {
    console.error("Error fetching service types:", error);
    setServiceTypeList([]); 
  });



}, []);


  const option = serviceTypeList.map((type) => ({
    value: type.name,
    label: type.name,
  }));

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
 
    try {
      const bookingData = {
        customerName: name,
        customerPhone: tel,
        serviceType: serviceType?.value || "",
        bookingDate: value.startDate
          ? value.startDate.toLocaleDateString()
          : "",
        timeSlot: selectedTime,
      };

     const response = await createQueue(bookingData);

      resetForm();

      navigate(`/users/booking-confirmation/${response.data._id}`, {
        state: { booking: response.data, customer: { customerName: name, customerPhone: tel } },
      });

    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  return (
    <div className="flex flex-col max-w-4xl w-full justify-center items-center mx-auto p-4">
      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-bold mb-4">User Bookings</h1>
      </div>
      <form className=" w-full lg:max-w-3xl mx-auto" onSubmit={handleSubmit}>
        <Card className="w-full">
          <div className="p-4"></div>
          <div className="flex items-center gap-4 mb-4 md:flex-row flex-col">
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
           <Select options={option} className="w-full" value={serviceType} onChange={(e) => setServiceType(e)} placeholder="เลือกประเภทบริการ" isSearchable={true} isClearable={true} classNamePrefix="react-select"
        
           />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-full">
              <Label label="วันที่จอง" />

              <Datepicker
                displayFormat="DD/MM/YYYY"
                i18n={"th"}
                useRange={false}
                asSingle={true}
                value={value}
                onChange={(newValue) => {
                  if (newValue) {
                    setValue(
                      newValue as {
                        startDate: Date | null;
                        endDate: Date | null;
                      }
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
                    checked={selectedTime === "1"}
                    onChange={setSelectedTime}
                  />
                  <BoxSelect
                    id="2"
                    startTime="10.00"
                    endTime="11.00"
                    name="time-picker"
                    checked={selectedTime === "2"}
                    onChange={setSelectedTime}
                  />
                  <BoxSelect
                    id="3"
                    startTime="11.00"
                    endTime="12.00"
                    name="time-picker"
                    checked={selectedTime === "3"}
                    onChange={setSelectedTime}
                  />
                  <BoxSelect
                    id="4"
                    startTime="01.00"
                    endTime="02.00"
                    name="time-picker"
                    checked={selectedTime === "4"}
                    onChange={setSelectedTime}
                  />
                </div>
              </fieldset>
            </div>
          </div>
          <div className="flex lg:justify-end justify-center">
            <button type="submit" className="btn btn-primary">
              Confirm Booking
            </button>

            <button className="btn" onClick={handleClose}>
              Clear
            </button>
          </div>
        </Card>
      </form>
    </div>
  );
}
