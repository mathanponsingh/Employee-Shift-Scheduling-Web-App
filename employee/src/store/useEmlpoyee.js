import { create } from "zustand";
import { axiosInstance } from "../utils/axiosInstance";
import {toast} from 'react-hot-toast'

export const useEmployee = create((set, get) => ({
  employee: null,
  user: null,
  shifts: [],
  isAuthenticated:false,
  login: async (data) => {
    try {
      const response = await axiosInstance.post("/auth/employee-login", data);
      set({ employee: response.data,isAuthenticated:true });
      toast.sucess("Login successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/employee-checkauth");
      set({ employee: response.data.user });
      
    } catch (error) {
      console.log(error);
    }
  },
  getShifts: async () => {
    try {
      const response = await axiosInstance.get("/auth/employee/shift");
      set({ shifts: response.data });
    } catch (error) {
      console.log(error);
    }
  },

  logout: async () => {
    try {
      const response = await axiosInstance.post("/auth/employee-logout");
      if (response.status === 200) {
        set({
          employee: null,
          user: null,
          shifts: [],
          isAuthenticated:false
        }); 
      }
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
}));
