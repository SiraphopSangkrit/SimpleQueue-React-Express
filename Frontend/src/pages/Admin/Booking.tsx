import { Calendar } from "../../components/Calendar";
import type { CalendarEvent } from "../../components/Calendar";
import { BookingModal } from "../../components/Modals/BookingModal";
import Datepicker from "react-tailwindcss-datepicker";
import { useEffect, useState } from "react";
import { getAllQueues } from "../../api/QueueAPI";
import { Input } from "../../components/Inputs/Input";
import { BoxSelect } from "../../components/BoxSelect";
import { Card } from "../../components/Card";
import { createQueue } from "../../api/QueueAPI";
import { useNavigate } from "react-router";
import { getServiceTypes, getTimeSlots } from "../../api/SettingsAPI";
import { Label } from "../../components/Inputs/Label";

export function Booking() {
  const navigate = useNavigate();
  const [value, setValue] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });
  const [data, setData] = useState<CalendarEvent[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [tel, setTel] = useState<string>("");
  const [serviceTypeList, setServiceTypeList] = useState<any[]>([]);
  const [serviceType, setServiceType] = useState<any>(null);
  const [timeSlots, setTimeSlots] = useState<any[]>([]);

  const [errors, setErrors] = useState({
    name: "",
    tel: "",
    serviceType: "",
    date: "",
    time: "",
  });

  const fetchQueues = async () => {
    try {
      const response = await getAllQueues();
      const queuesArray = response.data || response.queues || response || [];
      setData(queuesArray);
      console.log("Queues fetched successfully:", queuesArray);
    } catch (error) {
      console.error("Error fetching queues:", error);
      setData([]);
    }
  };

  useEffect(() => {
    getServiceTypes()
      .then((response) => {
        const serviceTypesArray =
          response.data || response.serviceTypes || response || [];
        setServiceTypeList(serviceTypesArray);
        console.log("Service types fetched successfully:", serviceTypesArray);
      })
      .catch((error) => {
        console.error("Error fetching service types:", error);
        setServiceTypeList([]);
      });

    getTimeSlots()
      .then((response) => {
        const timeSlotsArray =
          response.data || response.TimeSlots || response || [];
        setTimeSlots(timeSlotsArray);

        console.log("Time slots fetched successfully:", timeSlotsArray);
      })
      .catch((error) => {
        console.error("Error fetching time slots:", error);
        setTimeSlots([]);
      });

    fetchQueues();
    const modal = document.getElementById("modal-booking") as HTMLDialogElement;
     if (modal) {
    modal.addEventListener("close", handleClose);
    return () => modal.removeEventListener("close", handleClose);
  }
  }, []);

  const validateForm = () => {
    const newErrors = {
      name: name.trim() === "" ? "กรุณากรอกชื่อ-นามสกุล" : "",
      tel: tel.trim() === "" ? "กรุณากรอกเบอร์โทร" : "",
      serviceType: !serviceType ? "กรุณาเลือกประเภทบริการ" : "",
      date: !value?.startDate ? "กรุณาเลือกวันที่" : "",
      time: !selectedTime ? "กรุณาเลือกเวลาที่ต้องการจอง" : "",
    };

    setErrors(newErrors);

    // Auto-clear errors after 5 seconds
    Object.entries(newErrors).forEach(([field, message]) => {
      if (message) {
        setTimeout(() => {
          setErrors((prev) => ({ ...prev, [field]: "" }));
        }, 3000);
      }
    });

    // Return true if no errors
    return Object.values(newErrors).every((error) => error === "");
  };

  const resetForm = () => {
    setValue({ startDate: null, endDate: null });
    setSelectedTime("");
    setName("");
    setTel("");
    setServiceType(null);
    setErrors({
      name: "",
      tel: "",
      serviceType: "",
      date: "",
      time: "",
    });
  };

  const handleClose = () => {
    resetForm();
  };

  const serviceTypeOptions = serviceTypeList.map((type) => ({
    _id: type._id,
    value: type.name,
    label: type.name,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!validateForm()) {
        return;
      }

      const bookingData = {
        customerName: name,
        customerPhone: tel,
        serviceTypeId: serviceType?._id || "",
        bookingDate: value.startDate
          ? value.startDate.toLocaleDateString()
          : "",
        timeSlot: selectedTime,
      };

      await createQueue(bookingData);

      await fetchQueues();
      
      resetForm();

      const modal = document.getElementById(
        "modal-booking"
      ) as HTMLDialogElement;
      if (modal) {
        modal.close();
      }

      
    
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  const handleTimeChange = (timeSlotId: string) => {
    setSelectedTime(timeSlotId);
    if (errors.time) {
      setErrors((prev) => ({ ...prev, time: "" }));
    }
  };

  const calculateEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + duration;

    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;

    return `${endHours.toString().padStart(2, "0")}:${endMins
      .toString()
      .padStart(2, "0")}`;
  };

  // Add these handler functions to clear errors when user types/selects
  const handleNameChange = (value: string) => {
    setName(value);
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: "" }));
    }
  };

  const handleTelChange = (value: string) => {
    setTel(value);
    if (errors.tel) {
      setErrors((prev) => ({ ...prev, tel: "" }));
    }
  };

  // Update the handleServiceTypeChange function for native select
  const handleServiceTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedOption = serviceTypeOptions.find(
      (option) => option._id === selectedId
    );
    setServiceType(selectedOption || null);
    if (errors.serviceType) {
      setErrors((prev) => ({ ...prev, serviceType: "" }));
    }
  };

  const handleDateChange = (newValue: any) => {
    if (newValue) {
      setValue(newValue as { startDate: Date | null; endDate: Date | null });
      if (errors.date) {
        setErrors((prev) => ({ ...prev, date: "" }));
      }
    }
  };
 

  return (
    <div className="flex flex-col items-center justify-center ">
      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-bold mb-4">Booking</h1>
        <button
          className="btn btn-primary"
          onClick={() =>
            (
              document.getElementById("modal-booking") as HTMLDialogElement
            )?.showModal()
          }
        >
         เพิ่มคิว
        </button>
      </div>
      <div className="w-full ">
        <Calendar data={data} onDataUpdate={setData} />
      </div>
      <BookingModal id="modal-booking">
        <form className=" w-full lg:max-w-3xl mx-auto" onSubmit={handleSubmit}>
          <Card className="w-full">
            <div className="p-4"></div>

            {/* Name and Phone inputs */}
            <div className="flex items-center gap-4 mb-4 md:flex-row flex-col">
              <div className="flex-2 w-full">
                <Input
                  boxClassName="w-full"
                  label="ชื่อ-นามสกุล"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="ชื่อ-นามสกุล"
                  type="text"
                  name="name"
                  className={errors.name ? "border-red-500" : ""}
                />

                {errors.name && (
                  <p className="text-red-500 text-sm mt-1 absolute">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="flex-1 w-full">
                <Input
                  boxClassName="w-full"
                  label="เบอร์โทร"
                  value={tel}
                  onChange={handleTelChange}
                  placeholder="เบอร์โทร"
                  type="text"
                  name="tel"
                  className={errors.tel ? "border-red-500" : ""}
                />
                {errors.tel && (
                  <p className="text-red-500 text-sm mt-1 absolute">
                    {errors.tel}
                  </p>
                )}
              </div>
            </div>

            {/* Service Type Select */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-full">
                <Label label="ประเภทบริการ" />
                <select
                  onChange={handleServiceTypeChange}
                  value={serviceType?._id || ""} // Use the _id for value
                  className={`select border w-full text-gray-700 dark:text-gray-300 bg-base-200 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.serviceType ? "border-red-500" : ""
                  }`}
                >
                  <option value="" disabled>
                    เลือกประเภทบริการ
                  </option>
                  {serviceTypeOptions.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.serviceType && (
                  <p className="text-red-500 text-sm mt-1 absolute">
                    {errors.serviceType}
                  </p>
                )}
              </div>
            </div>

            {/* Date Picker */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-full">
                <Label label="วันที่จอง" />
                <Datepicker
                  displayFormat="DD/MM/YYYY"
                  i18n={"th"}
                  useRange={false}
                  asSingle={true}
                  value={value}
                  onChange={handleDateChange}
                  inputClassName={`input w-full text-gray-700 dark:text-gray-300 bg-base-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.date ? "border-red-500" : ""
                  }`}
                />
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1 absolute">
                    {errors.date}
                  </p>
                )}
              </div>
            </div>

            {/* Time Slots */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-full">
                <Label label="เวลาที่จอง" />
                <fieldset>
                  <div className="grid sm:grid-cols-4 gap-2">
                    {timeSlots.map((slot) => (
                      <BoxSelect
                        key={slot._id}
                        id={`time-slot-${slot._id}`}
                        startTime={slot.StartTime}
                        endTime={calculateEndTime(
                          slot.StartTime,
                          slot.duration
                        )}
                        value={slot._id}
                        name="time-picker"
                        checked={selectedTime === slot._id}
                        onChange={handleTimeChange}
                        className={errors.time ? "border-red-500" : ""}
                      />
                    ))}
                  </div>
                  {errors.time && (
                    <p className="text-red-500 text-sm mt-1 absolute">
                      {errors.time}
                    </p>
                  )}
                </fieldset>
              </div>
            </div>

            <div className="flex lg:justify-end justify-center">
              <button type="submit" className="btn btn-primary">
                Confirm Booking
              </button>
              <div className="btn" onClick={handleClose}>
                Clear
              </div>
            </div>
          </Card>
        </form>
      </BookingModal>
    </div>
  );
}
