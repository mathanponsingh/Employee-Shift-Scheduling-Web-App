import db from "../config/db.js";
import bcrypt from "bcryptjs";
import ExcelJS from "exceljs";

import { generateToken } from "../utils/generateToken.js";
// Utility function to generate JWT token and set cookie
export const shift_db = process.env.DB_NAME;
// ===================== ADMIN SIGNUP =====================
export const adminSignup = async (req, res) => {
  // Extract admin details from request body
  const { name, email, password } = req.body;

  try {
    // Validate required fields
    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if admin email already exists
    const [rows] = await db.query("SELECT * FROM admin WHERE email = ( ? ) ", [
      email,
    ]);

    if (rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Check if admin name already exists
    const [user] = await db.query("SELECT * FROM admin WHERE name = ?", [name]);

    if (user.length > 0) {
      return res.status(400).json({ message: "Admin name already exists" });
    }

    // Hash password before storing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert admin into database
    const [result] = await db.query(
      `INSERT INTO ${shift_db}.admin (email, password, name) VALUES (?, ?, ?)`,
      [email, hashedPassword, name],
    );


    // Generate JWT token and set cookie
    const token = generateToken(result.insertId, res);

    return res.status(200).json({ message: "Admin created successfully" });
  } catch (error) {
    console.log("Error comes from login admin controller : ", error);
    res.status(500).json({ error: error.message });
  }
};

// ===================== ADMIN LOGIN =====================
export const adminLogin = async (req, res) => {
  // Extract login credentials
  const { email, password } = req.body;

  try {
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Fetch admin by email
    const [rows] = await db.query("SELECT * FROM admin WHERE email = ?", [
      email,
    ]);

    if (rows.length == 0) {
      return res.status(400).json({ message: "Invalid email" });
    }

    // Password length validation (custom rule)
    if (password.length < 6) {
      return res.status(400).json({ message: "Invalid Pasword" });
    }

    const admin = rows[0];

    // Compare entered password with hashed password
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Generate JWT token
    const token = generateToken(admin.id, res);

    return res.status(200).json({ message: "Login successfully" });
  } catch (error) {
    console.log("Error comes from login admin controller : ", error);
    res.status(500).json({ error: error.message });
  }
};

// ===================== CREATE EMPLOYEE =====================
export const createEmployee = async (req, res) => {
  try {
    // Extract employee data
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if employee email already exists
    const [user] = await db.query("SELECT * FROM employees WHERE email = ?", [
      email,
    ]);

    if (user.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Check if employee name already exists
    const [isName] = await db.query("SELECT * FROM employees WHERE name = ?", [
      name,
    ]);

    if (isName.length > 0) {
      return res.status(409).json({ message: "Username already exists" });
    }

    // Hash employee password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert employee into database
    const [result] = await db.query(
      "INSERT INTO employees (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role],
    );

    res.status(201).json({
      message: "Employee created successfully",
    });
  } catch (error) {
    console.log("Error comes from Create employee controller : ", error);
    res.status(500).json({ error: error.message });
  }
};

// ===================== GET EMPLOYEES (WITH PAGINATION & SEARCH) =====================
export const getEmployees = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const offset = (page - 1) * limit;

    let sql = "SELECT * FROM employees"; // lowercase table name
    let countSql = "SELECT COUNT(*) as total FROM employees";
    const params = [];

    if (search) {
      const condition = " WHERE name LIKE ? OR email LIKE ?";
      sql += condition;
      countSql += condition;
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += " LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const [rows] = await db.query(sql, params);

    // Count query params
    const countParams = search ? [`%${search}%`, `%${search}%`] : [];
    const [countResult] = await db.query(countSql, countParams);

    const total = countResult[0].total;

    return res.status(200).json({
      employees: rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Error fetching employees:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ===================== DELETE EMPLOYEE =====================
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    // Check if employee exists
    const [rows] = await db.query("SELECT * FROM employees WHERE id = ?", [id]);

    if (rows.length == 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Delete employee
    await db.query("DELETE FROM employees WHERE id = ?", [id]);

    return res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.log("Error comes from deleteEmployees Controller ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ===================== UPDATE EMPLOYEE =====================
export const updateEmployee = async (req, res) => {
  // Extract updated data
  const { name, email } = req.body;

  try {
    const { id } = req.params;

    // Validate input
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    // Check if email already exists
    const [user] = await db.query(
      "select * from employees where email = ( ? )",
      [email],
    );

    if (user.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Update employee
    const [rows] = await db.query(
      "UPDATE employees SET name = ? , email = ? WHERE id = ?",
      [name, email, id],
    );

    if (rows.affectedRows === 0) {
      return res.status(400).json({ message: "Employee not found" });
    }

    return res.status(200).json({ message: "Employee updated successfully" });
  } catch (error) {
    console.log("Error comes from updateRmployee Controller ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ===================== CREATE SHIFT =====================
export const shift = async (req, res) => {
  // Extract shift details
  const { employeeId, date, startTime, endTime } = req.body;

  try {
    // Validate required fields
    if (!employeeId || !date || !startTime || !endTime) {
      return res.status(400).json({ message: "Required all the parameters" });
    }

    // Check if employee exists
    const [user] = await db.query("SELECT * FROM employees WHERE id = ?", [
      employeeId,
    ]);

    if (user.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Insert shift
    await db.query(
      `INSERT INTO shifts (employee_id, shift_date, start_time, end_time)
       VALUES (?, ?, ?, ?)`,
      [employeeId, date, startTime, endTime],
    );

    res.status(201).json({ message: "Shift added successfully" });
  } catch (error) {
    console.error("Error comes from Shift Controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ===================== DELETE SHIFT =====================
export const deleteShipts = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if shift exists
    const [rows] = await db.query("SELECT * FROM shifts where id = ?", [id]);

    if (rows.length === 0) {
      return res.status(400).json({ message: "Shift not found" });
    }

    // Delete shift
    await db.query("DELETE FROM shifts WHERE id = ?", [id]);

    res.status(200).json({ message: "Shift deleted successfully" });
  } catch (error) {
    console.log("Error comes from DeleteShifts Controller ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ===================== UPDATE SHIFT =====================
export const updateShifts = async (req, res) => {
  const { shift_date, start_time, end_time } = req.body;
  const { id } = req.params;

  try {
    // Validate input
    if (!shift_date || !start_time || !end_time) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Update shift
    const [result] = await db.query(
      `UPDATE shifts
       SET shift_date = ?, start_time = ?, end_time = ?
       WHERE id = ?`,
      [shift_date, start_time, end_time, id],
    );

    // Check if shift exists
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Shift not found" });
    }

    return res.status(200).json({
      message: "Shift updated successfully",
    });
  } catch (error) {
    console.error("Update shift error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ===================== GET SHIFTS =====================
export const getShifts = async (req, res) => {
  try {
    const { employeeId, date, startDate, endDate } = req.query;

    // Base query with join
    let sql = `
      SELECT 
        s.id,
        s.shift_date,
        s.start_time,
        s.end_time,
        e.id AS employee_id,
        e.name AS employee_name,
        e.role
      FROM shifts s
      JOIN employees e ON s.employee_id = e.id
      WHERE 1=1
    `;

    const params = [];

    // Apply filters dynamically
    if (employeeId) {
      sql += " AND s.employee_id = ?";
      params.push(employeeId);
    }

    if (date) {
      sql += " AND s.shift_date = ?";
      params.push(date);
    }

    if (startDate && endDate) {
      sql += " AND s.shift_date BETWEEN ? AND ?";
      params.push(startDate, endDate);
    }

    // Execute query
    const [rows] = await db.query(sql, params);

    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch shifts",
    });
  }
};

// ===================== EXPORT SHIFTS TO EXCEL =====================
export const exportShifts = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let sql = `
      SELECT 
        e.name AS Employee,
        e.email AS Email,
        e.role AS Role,
        s.shift_date AS Date,
        s.start_time AS StartTime,
        s.end_time AS EndTime
      FROM shifts s
      JOIN employees e ON s.employee_id = e.id
    `;

    const params = [];

    // Apply date filter if provided
    if (startDate && endDate) {
      sql += " WHERE s.shift_date BETWEEN ? AND ?";
      params.push(startDate, endDate);
    }

    sql += " ORDER BY s.shift_date DESC, e.name ASC";

    const [rows] = await db.query(sql, params);

    // Create Excel workbook and sheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Shifts");

    // Define Excel columns
    worksheet.columns = [
      { header: "Employee", key: "Employee", width: 20 },
      { header: "Email", key: "Email", width: 30 },
      { header: "Role", key: "Role", width: 15 },
      { header: "Date", key: "Date", width: 15 },
      { header: "Start Time", key: "StartTime", width: 15 },
      { header: "End Time", key: "EndTime", width: 15 },
      { header: "Duration (Hrs)", key: "Duration", width: 15 },
    ];

    // Add rows and calculate duration
    rows.forEach((row) => {
      let duration = 0;

      if (row.StartTime && row.EndTime) {
        const [sh, sm] = row.StartTime.split(":").map(Number);
        const [eh, em] = row.EndTime.split(":").map(Number);

        let startMinutes = sh * 60 + sm;
        let endMinutes = eh * 60 + em;

        if (endMinutes < startMinutes) endMinutes += 24 * 60;

        duration = ((endMinutes - startMinutes) / 60).toFixed(2);
      }

      worksheet.addRow({
        ...row,
        Duration: duration,
      });
    });

    // Style header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    };

    // Set response headers for file download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=shifts_export.xlsx",
    );

    // Send Excel file
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({ message: "Failed to export shifts" });
  }
};

// ===================== CHECK AUTH =====================
export const checkAuth = async (req, res) => {
  try {
    // User is set by authentication middleware
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user logged in" });
    }

    // Return authenticated user
    return res.status(200).json({ user: req.user });
  } catch (error) {
    console.error("Error in checkAuth:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ===================== LOGOUT =====================
export const logout = async (req, res) => {
  try {
    // Clear JWT cookie
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ===================== GET ADMINS =====================
export const getAdmin = async (req, res) => {
  try {
    // Fetch all admins
    const [rows] = await db.query("select * from admin");

    return res.status(200).json(rows);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
