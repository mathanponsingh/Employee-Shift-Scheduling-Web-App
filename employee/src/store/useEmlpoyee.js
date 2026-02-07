export const useEmployee = create((set) => ({
  employee: null,
  shifts: [],
  isAuthenticated: false,
  loading: false,

  login: async (data) => {
    try {
      set({ loading: true });

      const response = await axiosInstance.post(
        "/auth/employee-login",
        data
      );

      set({
        employee: response.data.employee,
        isAuthenticated: true,
        loading: false,
      });

      toast.success(response.data.message);
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Login failed");
    }
  },

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/employee-checkauth");

      set({
        employee: response.data.user,
        isAuthenticated: true,
      });
    } catch {
      set({ employee: null, isAuthenticated: false });
    }
  },

  getShifts: async () => {
    try {
      const response = await axiosInstance.get("/auth/employee/shift");
      set({ shifts: response.data });
    } catch (error) {
      console.log(error.response?.data?.message);
    }
  },

  logout: async () => {
    await axiosInstance.post("/auth/employee-logout");
    set({
      employee: null,
      shifts: [],
      isAuthenticated: false,
    });
    toast.success("Logged out successfully");
  },
}));
