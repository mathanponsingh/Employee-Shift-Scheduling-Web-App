// server.jsx
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import adminRouter from "../routes/adminRoutes.js";
import employeeRouter from "../routes/employeeRoutes.js";

const app = express();

// ----------------- CORS CONFIG -----------------
app.use(
  cors({
    origin: [
      "https://your-admin-app.vercel.app", // production admin
      "https://your-employee-app.vercel.app", // production employee
    ],
    credentials: true, // allow cookies
  }),
);

// ----------------- JSON & COOKIE PARSING -----------------
app.use(express.json());
app.use(
  cookieParser({
    limit: "10mb",
  }),
);

// ----------------- ROUTES -----------------
app.use("/admin", adminRouter); // All admin routes: /auth/admin/...
app.use("/employee", employeeRouter); // All employee routes: /auth/employee/...

// ----------------- EXPORT FOR VERCEL -----------------
export default app;
