import express from "express";
import cors from "cors";
import "dotenv/config";
import adminRouter from "./routes/adminRoutes.js";
import employeeRouter from "./routes/employeeRoutes.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  cors({
    origin: [
      "https://employee-shift-scheduling-employee.vercel.app",
      "https://employee-shift-scheduling-admin.vercel.app",
    ],
      // ADD YOUR PRODUCTION FRONTEND URLs HERE
      // "https://your-admin-app.vercel.app",
      // "https://your-employee-app.vercel.app",
    credentials: true,
  }),
);
app.use(express.json());
app.use(
  cookieParser({
    limit: "10mb",
  }),
);

app.get("/", (req, res) => {
  res.send("Backend is running properly");
});

app.use("/auth", adminRouter);
app.use("/auth", employeeRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
