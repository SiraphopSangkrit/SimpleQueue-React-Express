import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL; 
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
  export const getQueuesStats = async () => {
    try {
      const response = await axios.get("/api/queues/stats");
      return response.data;
    } catch (error) {
      console.error("Error fetching queues stats:", error);
      throw error;
    }
  }
  export const getQueueByMonth = async () => {
    try {
      const response = await axios.get("/api/queues/month/weeks");
      return response.data;
    } catch (error) {
      console.error("Error fetching queues by month:", error);
      throw error;
    }

  }
  
