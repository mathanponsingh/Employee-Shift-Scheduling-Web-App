// Import JWT library for token verification
import jwt from "jsonwebtoken";

// Import database connection pool
import pool from "../config/db.js";

/**
 * =========================
 * ADMIN AUTHENTICATION MIDDLEWARE
 * Protect routes to ensure only logged-in admins can access
 * =========================
 */
export const protect = async (req, res, next) => {
  // Get JWT token from cookies
  const token = req.cookies.jwt;

  // If no token is present, respond with unauthorized
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch admin details from DB using the ID from the token
    const [rows] = await pool.query(
      "SELECT id, email FROM admin WHERE id = ?",
      [decoded.id],
    );

    // If admin not found in DB, respond with unauthorized
    if (!rows.length) {
      return res.status(401).json({ message: "Admin not found" });
    }

    // Attach admin info to request object for downstream use
    req.user = rows[0];

    // Call next middleware or route handler
    next();
  } catch (error) {
    // If token is invalid or verification fails
    return res.status(401).json({ message: "Token invalid" });
  }
};
