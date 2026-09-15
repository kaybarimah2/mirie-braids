const express = require("express");
const { pool } = require("../db");
const uploadVideo = require("../middleware/uploadVideo");
const { requireAdmin } = require("../middleware/auth");
const { uploadFile, deleteFile } = require("../storage");
const asyncHandler = require("../asyncHandler");

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query("SELECT * FROM video_testimonials ORDER BY sort_order ASC, id ASC");
    res.json(rows);
  })
);

router.post(
  "/",
  requireAdmin,
  uploadVideo.single("video"),
  asyncHandler(async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "video is required" });
    const { caption, sort_order } = req.body || {};
    const video_path = await uploadFile(req.file.buffer, req.file.originalname, req.file.mimetype);

    const { rows } = await pool.query(
      "INSERT INTO video_testimonials (video_path, caption, sort_order) VALUES ($1, $2, $3) RETURNING *",
      [video_path, caption || null, Number(sort_order) || 0]
    );
    res.status(201).json(rows[0]);
  })
);

router.put(
  "/:id",
  requireAdmin,
  uploadVideo.single("video"),
  asyncHandler(async (req, res) => {
    const { rows: existingRows } = await pool.query("SELECT * FROM video_testimonials WHERE id = $1", [
      req.params.id,
    ]);
    const existing = existingRows[0];
    if (!existing) return res.status(404).json({ error: "Not found" });

    const caption = req.body.caption ?? existing.caption;
    const sort_order = req.body.sort_order !== undefined ? Number(req.body.sort_order) : existing.sort_order;
    let video_path = existing.video_path;

    if (req.file) {
      video_path = await uploadFile(req.file.buffer, req.file.originalname, req.file.mimetype);
      deleteFile(existing.video_path).catch(() => {});
    }

    const { rows } = await pool.query(
      "UPDATE video_testimonials SET video_path = $1, caption = $2, sort_order = $3 WHERE id = $4 RETURNING *",
      [video_path, caption, sort_order, req.params.id]
    );
    res.json(rows[0]);
  })
);

router.delete(
  "/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { rows: existingRows } = await pool.query("SELECT * FROM video_testimonials WHERE id = $1", [
      req.params.id,
    ]);
    const existing = existingRows[0];
    if (!existing) return res.status(404).json({ error: "Not found" });
    deleteFile(existing.video_path).catch(() => {});
    await pool.query("DELETE FROM video_testimonials WHERE id = $1", [req.params.id]);
    res.json({ ok: true });
  })
);

module.exports = router;
