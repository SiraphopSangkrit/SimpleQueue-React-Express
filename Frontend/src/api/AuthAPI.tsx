import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true; // Enable cookies 

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  name?: string;
  role?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      _id: string;
      email: string;
      username: string;
      name: string;
      role: string;
    };
    token: string;
  };
}

export interface ProfileResponse {
  success: boolean;
  message?: string;
  data?: {
    user: {
      _id: string;
      email: string;
      username: string;
      name: string;
      role: string;
    };
  };
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await axios.post("/api/auth/login", data);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await axios.post("/api/auth/register", data);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
};

export const getProfile = async (): Promise<ProfileResponse> => {
  try {
    const response = await axios.get("/api/auth/profile");
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
};

export const changePassword = async (data: ChangePasswordData): Promise<AuthResponse> => {
  try {
    const response = await axios.put("/api/auth/change-password", data);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
};

export const logout = async (): Promise<AuthResponse> => {
  try {
    const response = await axios.post("/api/auth/logout");
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    throw error;
  }
};

