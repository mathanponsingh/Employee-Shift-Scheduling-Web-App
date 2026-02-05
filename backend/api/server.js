import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import adminRouter from "../routes/adminRoutes.js";
import employeeRouter from "../routes/employeeRoutes.js";

const app = express();

// ----------------- DYNAMIC CORS CONFIG -----------------
const allowedOrigins = [
  "https://employee-shift-scheduling-admin.vercel.app",
  "https://employee-shift-scheduling-employee.vercel.app",
  // This Regex allows any Vercel preview URL from your project
  /\.vercel\.app$/ 
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      
      const isAllowed = allowedOrigins.some((allowed) => {
        return allowed instanceof RegExp ? allowed.test(origin) : allowed === origin;
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ----------------- JSON & COOKIE PARSING -----------------
app.use(express.json());
app.use(cookieParser()); // Note: limit is usually for body-parser, not cookie-parser

app.get("/", (req, res) => {
  res.status(200).json({ status: "OK", service: "backend" });
});

// ----------------- ROUTES -----------------
app.use("/auth", adminRouter);
app.use("/auth", employeeRouter);

export default app;
