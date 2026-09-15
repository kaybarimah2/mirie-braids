const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  const admin = db.prepare("SELECT * FROM admin WHERE username = ?").get(username);
  if (!admin || !bcrypt.compareSync(password, admin.password_hash)) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  const token = jwt.sign({ id: admin.id, username: admin.username }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.json({ token, username: admin.username });
});

router.post("/change-password", require("../middleware/auth").requireAdmin, (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Current and new password are required" });
  }
  const admin = db.prepare("SELECT * FROM admin WHERE id = ?").get(req.admin.id);
  if (!bcrypt.compareSync(currentPassword, admin.password_hash)) {
    return res.status(401).json({ error: "Current password is incorrect" });
  }
  const hash = bcrypt.hashSync(newPassword, 10);
  db.prepare("UPDATE admin SET password_hash = ? WHERE id = ?").run(hash, admin.id);
  res.json({ ok: true });
});

module.exports = router;
