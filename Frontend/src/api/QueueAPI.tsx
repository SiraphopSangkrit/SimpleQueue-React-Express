import axios from "axios";

axios.defaults.baseURL = 'http://localhost:3000'; 
export interface UserBookingProps {
  customerName: string;
  customerPhone: string;
  serviceType: string;
  bookingDate: string;
  timeSlot: string;
  notes?: string;
}

export const createQueue = async (data: UserBookingProps) => {
    try {
      const response = await axios.post("/api/queues/create", data);
      return response.data;
    } catch (error) {
      console.error("Error creating queue:", error);
      throw error;
    }
  };

  export const getAllQueues = async () => {
    try {
      const response = await axios.get("/api/queues");
      return response.data;
    } catch (error) {
      console.error("Error fetching queues:", error);
      throw error;
    }
  }
