import express from "express";
import {
  adminLogin,
  createEmployee,
  deleteEmployee,
  getEmployees,
  shift,
  updateEmployee,
  getShifts,
  deleteShipts,
  updateShifts,
  checkAuth,
  adminSignup,
  logout,
  getAdmin,
  exportShifts,
} from "../controllers/AdminController.js";
import { protect } from "../middleware/protect.js";

const adminRouter = express.Router();

adminRouter.post("/admin-signup", adminSignup);
adminRouter.post("/admin-login", adminLogin);
adminRouter.post("/employees", protect, createEmployee);
adminRouter.get("/employees", protect, getEmployees);
adminRouter.delete("/employees/:id", protect, deleteEmployee);
adminRouter.put("/employees/:id", protect, updateEmployee);
adminRouter.post("/shifts", protect, shift);
adminRouter.get("/shifts", protect, getShifts);
adminRouter.delete("/shifts/:id", protect, deleteShipts);
adminRouter.put("/shifts/:id", protect, updateShifts);
adminRouter.get("/export-shifts", protect, exportShifts);
adminRouter.get("/shifts/:employeeId/:date", getShifts);
adminRouter.get("/checkAuth", protect, checkAuth);
adminRouter.post("/logout", protect, logout);
adminRouter.get("/admins", protect, getAdmin);


export default adminRouter;
