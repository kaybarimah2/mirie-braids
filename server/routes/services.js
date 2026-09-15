const express = require("express");
const fs = require("fs");
const path = require("path");
const db = require("../db");
const upload = require("../middleware/upload");
const { requireAdmin } = require("../middleware/auth");
const uploadsDir = require("../uploadsDir");

const router = express.Router();

router.get("/", (req, res) => {
  const rows = db.prepare("SELECT * FROM services ORDER BY sort_order ASC, id ASC").all();
  res.json(rows);
});

router.post("/", requireAdmin, upload.single("image"), (req, res) => {
  const { name, price_text, sort_order } = req.body || {};
  if (!name || !price_text) {
    return res.status(400).json({ error: "name and price_text are required" });
  }
  const image_path = req.file ? `/uploads/${req.file.filename}` : null;
  const info = db
    .prepare("INSERT INTO services (name, price_text, image_path, sort_order) VALUES (?, ?, ?, ?)")
    .run(name, price_text, image_path, Number(sort_order) || 0);
  const row = db.prepare("SELECT * FROM services WHERE id = ?").get(info.lastInsertRowid);
  res.status(201).json(row);
});

router.put("/:id", requireAdmin, upload.single("image"), (req, res) => {
  const existing = db.prepare("SELECT * FROM services WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Not found" });

  const name = req.body.name ?? existing.name;
  const price_text = req.body.price_text ?? existing.price_text;
  const sort_order = req.body.sort_order !== undefined ? Number(req.body.sort_order) : existing.sort_order;
  let image_path = existing.image_path;

  if (req.file) {
    image_path = `/uploads/${req.file.filename}`;
    if (existing.image_path) {
      const oldFile = path.join(uploadsDir, path.basename(existing.image_path));
      fs.unlink(oldFile, () => {});
    }
  }

  db.prepare("UPDATE services SET name = ?, price_text = ?, image_path = ?, sort_order = ? WHERE id = ?").run(
    name,
    price_text,
    image_path,
    sort_order,
    req.params.id
  );
  const row = db.prepare("SELECT * FROM services WHERE id = ?").get(req.params.id);
  res.json(row);
});

router.delete("/:id", requireAdmin, (req, res) => {
  const existing = db.prepare("SELECT * FROM services WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Not found" });
  if (existing.image_path) {
    const file = path.join(uploadsDir, path.basename(existing.image_path));
    fs.unlink(file, () => {});
  }
  db.prepare("DELETE FROM services WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
