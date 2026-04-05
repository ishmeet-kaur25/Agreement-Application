const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL Connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false },
});

// Signup Route
app.post("/users", async (req, res) => {
  const { name, email, password, phone, designation } = req.body;

  if (!name || !email || !password || !phone || !designation) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const result = await pool.query(
      "INSERT INTO users (name, email, password, phone, designation) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, email, password, phone, designation]
    );

    res.status(201).json({ message: "Signup successful!", user: result.rows[0] });
  } catch (err) {
    console.error("Error inserting user:", err);

    if (err.code === "23505") {
      return res.status(409).json({ message: "Email already exists." });
    }

    res.status(500).json({ message: "An error occurred. Please try again." });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );

    if (result.rows.length > 0) {
      return res.status(200).json({ success: true, message: "Login successful!" });
    } else {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "An error occurred. Please try again." });
  }
});

app.post("/agreement", async (req, res) => {
  const {
    agreementCategory,
    agreementType,
    lineOfBusiness,
    agreementStatus,
    paymentTerm,
    remarks,
    counterSignStatus,
    action,
    startDate,
    endDate,
    sbuHead,
    actionTakenDate,
    finalStatus,
    finalStatusDate,
    finalStatusRemark,
    sbuunit,
    accountManager,
    agreementDetail,
  } = req.body;

  if (!agreementCategory ) {
    return res.status(400).json({ message: "All required fields must be provided." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO agreement (
        "Agreement Category", "Agreement Type", "Line Of Business", "Agreement Status",
        "Payment Term", "Remarks", "Counter Sign Status", "Action",
        "start date", "end date", "SBU Head", "Action Taken Date",
        "Final Status", "Final Status Date", "Final Status Remark",
        "SBU unit", "Account Manager", "Agreement Detail",
        created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4,
        $5, $6, $7, $8,
        $9, $10, $11, $12,
        $13, $14, $15,
        $16, $17, $18,
        NOW(), NOW()
      ) RETURNING *`,
      [
        agreementCategory,
        agreementType || null,
        lineOfBusiness || null,
        agreementStatus,
        paymentTerm || null,
        remarks || null,
        counterSignStatus || null,
        action || null,
        startDate || null,
        endDate || null,
        sbuHead || null,
        actionTakenDate || null,
        finalStatus || null,
        finalStatusDate || null,
        finalStatusRemark || null,
        sbuunit || null,
        accountManager || null,
        agreementDetail || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Agreement successfully created.",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("Error inserting agreement:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});


// Get All Agreements
app.get("/agreement", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, * FROM agreement 
       ORDER BY "updated_at" DESC NULLS LAST, "created_at" DESC NULLS LAST`
    );
    if (result.rows.length > 0) {
      res.status(200).json({ success: true, data: result.rows });
    } else {
      res.status(404).json({ success: false, message: "No agreements found." });
    }
  } catch (err) {
    console.error("Database query error:", err.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// Get Single Agreement
app.get("/agreement/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM agreement WHERE id = $1",
      [id]
    );

    if (result.rows.length > 0) {
      res.status(200).json({ success: true, data: result.rows[0] });
    } else {
      res.status(404).json({ success: false, message: "Agreement not found." });
    }
  } catch (err) {
    console.error("Error fetching agreement:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// Update Agreement
app.put("/agreement/:id", async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  
  

  try {
    const columns = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updateData)) {
      if (key.toLowerCase() === 'id') continue;
      columns.push(`"${key}" = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }

    columns.push(`updated_at = NOW()`);
    values.push(id);

    const query = `UPDATE agreement SET ${columns.join(', ')} WHERE id = $${paramIndex} RETURNING *`;

    const result = await pool.query(query, values);

    if (result.rows.length > 0) {
      res.status(200).json({
        success: true,
        message: "Agreement updated successfully.",
        data: result.rows[0],
      });
    } else {
      res.status(404).json({ success: false, message: "Agreement not found." });
    }
  } catch (err) {
    console.error("Error updating agreement:", err);
    res.status(500).json({
      success: false,
      message: "Server error.",
      error: err.message
    });
  }
});

// Delete Agreement
app.delete("/agreement/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM agreement WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length > 0) {
      res.status(200).json({
        success: true,
        message: "Agreement deleted successfully.",
        deletedId: result.rows[0].id
      });
    } else {
      res.status(404).json({ success: false, message: "Agreement not found." });
    }
  } catch (err) {
    console.error("Error deleting agreement:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// Forget Password
app.post("/forget-password", async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Email and new password are required."
    });
  }

  try {
    const userCheck = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User with this email not found."
      });
    }

    const result = await pool.query(
      "UPDATE users SET password = $1 WHERE email = $2 RETURNING email",
      [newPassword, email]
    );

    if (result.rowCount > 0) {
      res.status(200).json({
        success: true,
        message: "Password updated successfully.",
        data: {
          email: result.rows[0].email
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to update password."
      });
    }
  } catch (err) {
    console.error("Error in forget-password:", err);
    res.status(500).json({
      success: false,
      message: "An error occurred while resetting password.",
      error: err.message
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
