import { create } from "zustand";
import { axiosInstance } from "../utils/axiosInstance";
import toast from "react-hot-toast";


export const UseEmployeeStore = create((set,get) => ({
  
  employee: [], // Stores employee list
  pagination: null, // Stores pagination details
  admin: null, // Stores logged-in admin data
  admins: [], // Stores all admins
  LoginEmployee: null, // Stores logged-in employee data
  shifts: [], // Stores shift data
  isAuthenticated:false,
  
  getShifts: async (params = {}) => {
    try {
      // Destructure optional filter parameters
      const { employeeId, date, startDate, endDate } = params;

      // Build query parameters dynamically
      const queryParams = new URLSearchParams();
      if (employeeId) queryParams.append("employeeId", employeeId);
      if (date) queryParams.append("date", date);
      if (startDate) queryParams.append("startDate", startDate);
      if (endDate) queryParams.append("endDate", endDate);

      // Fetch shifts from backend
      const res = await axiosInstance.get(
        `/auth/shifts?${queryParams.toString()}`,
      );

      // Update shifts in store
      set({ shifts: res.data });
    } catch (err) {
      // Log error if shift fetching fails
      console.error("Failed to fetch shifts", err);
    }
  },

  addShift: async (data) => {
  try {
    const response = await axiosInstance.post("/auth/shifts", {
      employeeId: Number(data.employeeId),
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
    });

    toast.success(response.data.message);

    // 🔥 REFRESH SHIFTS
    await get().getShifts();
  } catch (error) {
    toast.error(error.response?.data.message);
  }
},
  
  // ===================== EMPLOYEES =====================
  createEmployee: async (data) => {
  try {
    const response = await axiosInstance.post("/auth/employees", data);

    toast.success(response.data.message);

    // 🔥 REFRESH EMPLOYEES
    await get().getEmployee({ page: 1, search: "" });
  } catch (error) {
    toast.error(error.response?.data.message || "Something went wrong");
  }
},


  getEmployee: async (params = {}) => {
    try {
      // Default pagination and search values
      const { page = 1, limit = 10, search = "" } = params;

      // Build query string
      const queryParams = new URLSearchParams({ page, limit, search });

      // Fetch employees with pagination
      const response = await axiosInstance.get(
        `/auth/employees?${queryParams.toString()}`,
      );

      // Update employee list and pagination info
      set({
        employee: response.data.employees,
        pagination: response.data.pagination,
      });
    } catch (error) {
      // Log error if fetching employees fails
      console.error("Error fetching employees", error.response?.data.message);
    }
  },

  deleteEmployee: async (id) => {
  try {
    const response = await axiosInstance.delete(`/auth/employees/${id}`);

    toast.success(response.data.message);

    // 🔥 REFRESH EMPLOYEES (keep current page)
    const { pagination } = get();
    await get().getEmployee({
      page: pagination?.page || 1,
      search: "",
    });
  } catch (error) {
    toast.error(error.response?.data.message);
  }
},


  updateEmployee: async (data) => {
  try {
    const { id, email, name } = data;

    const response = await axiosInstance.put(`/auth/employees/${id}`, {
      email,
      name,
    });

    toast.success(response.data.message);

    // 🔥 REFRESH EMPLOYEES
    const { pagination } = get();
    await get().getEmployee({
      page: pagination?.page || 1,
      search: "",
    });
  } catch (error) {
    toast.error(error.response?.data.message);
  }
},


  // ===================== SHIFTS UPDATE & DELETE =====================
  deleteSchedule: async (id) => {
  try {
    const response = await axiosInstance.delete(`/auth/shifts/${id}`);

    toast.success(response.data.message);

    // 🔥 REFRESH SHIFTS
    await get().getShifts();
  } catch (error) {
    toast.error(error.response?.data.message);
  }
},


 updateShifts: async (data) => {
  try {
    const { id, startTime, endTime, date } = data;

    if (!id || !startTime || !endTime || !date) return;

    const payload = {
      shift_date: date,
      start_time: startTime,
      end_time: endTime,
    };

    const response = await axiosInstance.put(`/auth/shifts/${id}`, payload);

    toast.success(response.data.message);

    // 🔥 REFRESH SHIFTS
    await get().getShifts();
  } catch (error) {
    toast.error(error.response?.data.message);
  }
},


  // ===================== AUTH =====================
  loginAdmin: async (data) => {
    try {
      // Admin login
      const response = await axiosInstance.post("/auth/admin-login", data);

      // Store admin data in state
      set({ admin: response.data,isAuthenticated:true });

      // Show success message
      toast.success(response.data.message);
    } catch (error) {
      // Show error message
      toast.error(error.response?.data.message);
    }
  },

  checkAuth: async () => {
    try {
      // Check if admin session is still valid
      const response = await axiosInstance.get("/auth/checkAuth");

      // Update admin data
      set({ admin: response.data.user });
    } catch (error) {
      // Log authentication error
      console.log(error.response.data.message);
    }
  },

  logout: async () => {
    try {
      // Logout current user
      const response = await axiosInstance.post("/auth/logout");

      // Clear all stored data
      set({
        employee: [],
        admin: null,
        LoginEmployee: null,
        shifts: [],
        isAuthenticated:false
      });

      // Show success message
      toast.success(response.data.message);
    } catch (error) {
      // Log logout error
      console.log(error.response.data.message);
    }
  },

  // ===================== ADMINS =====================
  createAdmin: async (data) => {
    try {
      // Create new admin
      const response = await axiosInstance.post("/auth/admin-signup", data);

      // Show success message
      toast.success(response.data.message);
    } catch (error) {
      // Show error message
      toast.error(error.response.data.message);
    }
  },

  getAdmins: async () => {
    try {
      // Fetch all admins
      const response = await axiosInstance.get("/auth/admins");

      // Update admins list
      set({ admins: response.data });
    } catch (error) {
      // Log error
      console.log(error.message);
    }
  },
}));
