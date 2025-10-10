import axios from "axios";



axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL; 

export interface ServiceTypeProps {
    _id?: string; // Optional for updates
  name: string;
  isActive?: boolean;
  order?: number;
}

export const addServiceType = async (data: ServiceTypeProps) => {
  try {
    const response = await axios.post("/api/settings/service-types", data);
    return response.data;
  } catch (error) {
    console.error("Error adding service type:", error);
    throw error;
  }
};


export const getSettings = async () => {
  try {
    const response = await axios.get("/api/settings");
    return response.data;
  } catch (error) {
    console.error("Error fetching settings:", error);
    throw error;
  }
};
export const getServiceTypes = async () => {
  try {
    const response = await getSettings();
    return response.data.serviceTypes || [];
  } catch (error) {
    console.error("Error fetching service types:", error);
    throw error;
  }
};
export const getTimeSlots = async () => {
  try {
    const response = await getSettings();
    return response.data.TimeSlots || [];
  } catch (error) {
    console.error("Error fetching time slots:", error);
    throw error;
  }
};
export const deleteServiceType = async (id: string) => {
  try {
    const response = await axios.delete(`/api/settings/service-types/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting service type:", error);
    throw error;
  }
};
