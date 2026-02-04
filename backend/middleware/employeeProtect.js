// Import JWT library for token verification
import jwt from "jsonwebtoken";

// Import database connection pool
import pool from "../config/db.js";

/**
 * =========================
 * EMPLOYEE AUTHENTICATION MIDDLEWARE
 * Protect routes and ensure the user is logged in
 * =========================
 */
export const employeeProtect = async (req, res, next) => {
  // Get JWT token from cookies
  const token = req.cookies?.jwt;

  // If no token, user is not authorized
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // Verify the token using secret key
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    // Fetch employee from DB using the ID from the token
    const [rows] = await pool.query(
      "SELECT * FROM employees WHERE id = ( ? )",
      [decoded.id],
    );

    // If employee not found in DB
    if (!rows.length) {
      return res.status(401).json({ message: "Admin not found" });
    }

    // Attach employee info to request object for downstream use
    req.user = rows[0];

    // Call next middleware or route handler
    next();
  } catch (error) {
    // Token verification failed
    return res.status(401).json({ message: "Token invalid" });
  }
};
