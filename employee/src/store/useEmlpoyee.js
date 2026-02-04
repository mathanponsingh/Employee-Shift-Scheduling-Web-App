import { create } from "zustand";
import { axiosInstance } from "../utils/axiosInstance";

export const useEmployee = create((set, get) => ({
  employee: null,
  user: null,
  shifts: [],
  login: async (data) => {
    try {
      const response = await axiosInstance.post("/auth/employee-login", data);
      set({ employee: response.data });
    } catch (error) {
      console.log(error);
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
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
}));
