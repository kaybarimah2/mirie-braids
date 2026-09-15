const express = require("express");
const db = require("../db");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/", (req, res) => {
  const rows = db.prepare("SELECT * FROM testimonials ORDER BY sort_order ASC, id DESC").all();
  res.json(rows);
});

router.post("/", requireAdmin, (req, res) => {
  const { client_name, message, sort_order } = req.body || {};
  if (!client_name || !message) {
    return res.status(400).json({ error: "client_name and message are required" });
  }
  const info = db
    .prepare("INSERT INTO testimonials (client_name, message, sort_order) VALUES (?, ?, ?)")
    .run(client_name, message, Number(sort_order) || 0);
  const row = db.prepare("SELECT * FROM testimonials WHERE id = ?").get(info.lastInsertRowid);
  res.status(201).json(row);
});

router.put("/:id", requireAdmin, (req, res) => {
  const existing = db.prepare("SELECT * FROM testimonials WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Not found" });

  const client_name = req.body.client_name ?? existing.client_name;
  const message = req.body.message ?? existing.message;
  const sort_order = req.body.sort_order !== undefined ? Number(req.body.sort_order) : existing.sort_order;

  db.prepare("UPDATE testimonials SET client_name = ?, message = ?, sort_order = ? WHERE id = ?").run(
    client_name,
    message,
    sort_order,
    req.params.id
  );
  const row = db.prepare("SELECT * FROM testimonials WHERE id = ?").get(req.params.id);
  res.json(row);
});

router.delete("/:id", requireAdmin, (req, res) => {
  const existing = db.prepare("SELECT * FROM testimonials WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Not found" });
  db.prepare("DELETE FROM testimonials WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
