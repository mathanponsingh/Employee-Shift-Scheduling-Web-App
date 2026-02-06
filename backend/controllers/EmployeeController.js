// Import database connection
import db from "../config/db.js";

// Import bcrypt for password hashing and comparison
import bcrypt from "bcryptjs";

// Import JWT token generator utility
import { generateToken } from "../utils/generateToken.js";

/**
 * =========================
 * EMPLOYEE LOGIN CONTROLLER
 * =========================
 */
export const loginEmployee = async (req, res) => {
  // Extract email and password from request body
  const { email, password } = req.body;

  try {
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if(password.length<6){
      return res.status(400).json({message:"Password length alteast 6 characters"})
    }
    // Fetch employee by email
    const [rows] = await db.query("SELECT * FROM employees WHERE email = ?", [
      email,
    ]);

    // If employee not found
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];

    // Compare provided password with hashed password in DB
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If password is invalid
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token and set cookie
    const token = generateToken(user.id, res);

    // Return success response with employee info
    return res.status(200).json({
      message: "Login successful",
      employeeId: user.id,
      name: user.name,
    });
  } catch (error) {
    // Log error and return 500 response
    console.error("Error in loginEmployee:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * =========================
 * GET SHIFTS FOR LOGGED-IN EMPLOYEE
 * =========================
 */
export const getShifts = async (req, res) => {
  try {
    // Fetch all shifts for employee based on their ID from req.user (set by auth middleware)
    const [rows] = await db.query(
      "SELECT * FROM shifts WHERE employee_id = ?",
      [req.user.id],
    );

    // Return shifts as JSON
    return res.json(rows);
  } catch (error) {
    // Log any errors during fetching
    console.log("Error comes from getShifts controller : ", error);
  }
};
