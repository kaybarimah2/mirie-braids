const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../db");
const asyncHandler = require("../asyncHandler");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const { rows } = await pool.query("SELECT * FROM admin WHERE username = $1", [username]);
    const admin = rows[0];
    if (!admin || !bcrypt.compareSync(password, admin.password_hash)) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign({ id: admin.id, username: admin.username }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ token, username: admin.username });
  })
);

router.post(
  "/change-password",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current and new password are required" });
    }
    const { rows } = await pool.query("SELECT * FROM admin WHERE id = $1", [req.admin.id]);
    const admin = rows[0];
    if (!bcrypt.compareSync(currentPassword, admin.password_hash)) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }
    const hash = bcrypt.hashSync(newPassword, 10);
    await pool.query("UPDATE admin SET password_hash = $1 WHERE id = $2", [hash, admin.id]);
    res.json({ ok: true });
  })
);

module.exports = router;
