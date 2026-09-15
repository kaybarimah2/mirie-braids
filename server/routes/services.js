const express = require("express");
const { pool } = require("../db");
const upload = require("../middleware/upload");
const { requireAdmin } = require("../middleware/auth");
const { uploadFile, deleteFile } = require("../storage");
const asyncHandler = require("../asyncHandler");

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query("SELECT * FROM services ORDER BY sort_order ASC, id ASC");
    res.json(rows);
  })
);

router.post(
  "/",
  requireAdmin,
  upload.single("image"),
  asyncHandler(async (req, res) => {
    const { name, price_text, sort_order } = req.body || {};
    if (!name || !price_text) {
      return res.status(400).json({ error: "name and price_text are required" });
    }
    const image_path = req.file ? await uploadFile(req.file.buffer, req.file.originalname, req.file.mimetype) : null;

    const { rows } = await pool.query(
      "INSERT INTO services (name, price_text, image_path, sort_order) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, price_text, image_path, Number(sort_order) || 0]
    );
    res.status(201).json(rows[0]);
  })
);

router.put(
  "/:id",
  requireAdmin,
  upload.single("image"),
  asyncHandler(async (req, res) => {
    const { rows: existingRows } = await pool.query("SELECT * FROM services WHERE id = $1", [req.params.id]);
    const existing = existingRows[0];
    if (!existing) return res.status(404).json({ error: "Not found" });

    const name = req.body.name ?? existing.name;
    const price_text = req.body.price_text ?? existing.price_text;
    const sort_order = req.body.sort_order !== undefined ? Number(req.body.sort_order) : existing.sort_order;
    let image_path = existing.image_path;

    if (req.file) {
      image_path = await uploadFile(req.file.buffer, req.file.originalname, req.file.mimetype);
      if (existing.image_path) {
        deleteFile(existing.image_path).catch(() => {});
      }
    }

    const { rows } = await pool.query(
      "UPDATE services SET name = $1, price_text = $2, image_path = $3, sort_order = $4 WHERE id = $5 RETURNING *",
      [name, price_text, image_path, sort_order, req.params.id]
    );
    res.json(rows[0]);
  })
);

router.delete(
  "/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { rows: existingRows } = await pool.query("SELECT * FROM services WHERE id = $1", [req.params.id]);
    const existing = existingRows[0];
    if (!existing) return res.status(404).json({ error: "Not found" });
    if (existing.image_path) {
      deleteFile(existing.image_path).catch(() => {});
    }
    await pool.query("DELETE FROM services WHERE id = $1", [req.params.id]);
    res.json({ ok: true });
  })
);

module.exports = router;
