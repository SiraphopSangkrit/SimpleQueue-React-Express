import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true; 
export interface UserBookingProps {
  customerName: string;
  customerPhone: string;
  serviceTypeId: string;
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

  export const getLatestQueue = async () => {
    try {
      const response = await axios.get(`/api/queues/latest`);
      return response.data;
    } catch (error) {
      console.error("Error fetching latest queue:", error);
      throw error;
    }
  };

  export const getQueueByMonth = async () => {
    try {
      const response = await axios.get("/api/queues/month/weeks");
      return response.data;
    } catch (error) {
      console.error("Error fetching queues by month:", error);
      throw error;
    }

  }

  export const getQueueByID= async(id:string)=>{
    try{
      const response = await axios.get(`/api/queues/${id}`);
      return response.data;
    }catch(error){
      console.error("Error fetching queue by ID:", error);
      throw error;
    }
  }

  export const updateQueueStatus = async (id: string, updateData: { status: string; notes?: string; completedAt?: string | null }) => {
    try {
      const response = await axios.patch(`/api/queues/${id}/update/status`, updateData);
      return response.data;
    } catch (error) {
      console.error("Error updating queue status:", error);
      throw error;
    }
  }

  export const updateQueue = async (id: string, updateData: any) => {
    try {
      const response = await axios.put(`/api/queues/update/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error("Error updating queue:", error);
      throw error;
    }
  }

  export const notifyStatusChange = async (id: string) => {
    try {
      const response = await axios.get(`/api/queues/n8n/notify/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error notifying status change:", error);
      throw error;
    }
  }
  
