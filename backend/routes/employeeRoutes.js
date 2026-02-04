import express from "express";
import { loginEmployee, getShifts } from "../controllers/EmployeeController.js";
import { checkAuth, logout } from "../controllers/AdminController.js";
import { employeeProtect } from "../middleware/employeeProtect.js";

const employeeRouter = express.Router();

employeeRouter.post("/employee-login", loginEmployee);
employeeRouter.get("/employee/shift", employeeProtect, getShifts);
employeeRouter.get("/employee-checkauth", employeeProtect, checkAuth);
employeeRouter.post("/employee-logout",logout);

export default employeeRouter;
