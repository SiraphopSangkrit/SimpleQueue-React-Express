import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true; 


export interface CustomerProps {
  _id?: string; 
  customerName: string;
  customerPhone: string;
  customerLineId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const getAllCustomers = async () => {
  try {
    const response = await axios.get("/api/customers");
    return response.data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};