import express from "express";
import cors from "cors";
import "dotenv/config";
import adminRouter from "./routes/adminRoutes.js";
import employeeRouter from "./routes/employeeRoutes.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  cors({
    origin: true,
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

app.use("/auth", adminRouter);
app.use("/auth", employeeRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
