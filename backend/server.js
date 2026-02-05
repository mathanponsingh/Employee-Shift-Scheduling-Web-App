import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config"; // Added for local dev environment variables

import adminRouter from "./routes/adminRoutes.js"; // Fixed path (was ../)
import employeeRouter from "./routes/employeeRoutes.js"; // Fixed path (was ../)

const app = express();

// ----------------- CORS CONFIG -----------------
app.use(
  cors({
    origin: [
      "https://employee-shift-scheduling-admin.vercel.app", // production admin
      "https://employee-shift-scheduling-employee.vercel.app", // production employee (removed trailing slash)
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

app.get("/", (req, res) => {
  res.status(200).json({ status: "OK", service: "backend" });
});

// ----------------- ROUTES -----------------
// Note: User requested /admin and /employee prefixes.
// Previously this was /auth. Ensure frontend matches these routes.
app.use("/admin", adminRouter);
app.use("/employee", employeeRouter);

// ----------------- START SERVER (LOCAL & VERCEL) -----------------
const PORT = process.env.PORT || 3000;
// Only listen if not running in a Vercel serverless environment (implicitly handled, but safe to add)
// or just standard conditional listen.
if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
} else {
    // Optional: Log for Vercel logs
    console.log("App initialized for Vercel");
}

// ----------------- EXPORT FOR VERCEL -----------------
export default app;
