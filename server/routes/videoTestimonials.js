const express = require("express");
const fs = require("fs");
const path = require("path");
const db = require("../db");
const uploadVideo = require("../middleware/uploadVideo");
const { requireAdmin } = require("../middleware/auth");
const uploadsDir = require("../uploadsDir");

const router = express.Router();

router.get("/", (req, res) => {
  const rows = db.prepare("SELECT * FROM video_testimonials ORDER BY sort_order ASC, id ASC").all();
  res.json(rows);
});

router.post("/", requireAdmin, uploadVideo.single("video"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "video is required" });
  const { caption, sort_order } = req.body || {};
  const video_path = `/uploads/${req.file.filename}`;
  const info = db
    .prepare("INSERT INTO video_testimonials (video_path, caption, sort_order) VALUES (?, ?, ?)")
    .run(video_path, caption || null, Number(sort_order) || 0);
  const row = db.prepare("SELECT * FROM video_testimonials WHERE id = ?").get(info.lastInsertRowid);
  res.status(201).json(row);
});

router.put("/:id", requireAdmin, uploadVideo.single("video"), (req, res) => {
  const existing = db.prepare("SELECT * FROM video_testimonials WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Not found" });

  const caption = req.body.caption ?? existing.caption;
  const sort_order = req.body.sort_order !== undefined ? Number(req.body.sort_order) : existing.sort_order;
  let video_path = existing.video_path;

  if (req.file) {
    video_path = `/uploads/${req.file.filename}`;
    const oldFile = path.join(uploadsDir, path.basename(existing.video_path));
    fs.unlink(oldFile, () => {});
  }

  db.prepare("UPDATE video_testimonials SET video_path = ?, caption = ?, sort_order = ? WHERE id = ?").run(
    video_path,
    caption,
    sort_order,
    req.params.id
  );
  const row = db.prepare("SELECT * FROM video_testimonials WHERE id = ?").get(req.params.id);
  res.json(row);
});

router.delete("/:id", requireAdmin, (req, res) => {
  const existing = db.prepare("SELECT * FROM video_testimonials WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Not found" });
  const file = path.join(uploadsDir, path.basename(existing.video_path));
  fs.unlink(file, () => {});
  db.prepare("DELETE FROM video_testimonials WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
