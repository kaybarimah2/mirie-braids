const express = require("express");
const { pool } = require("../db");
const { requireAdmin } = require("../middleware/auth");
const asyncHandler = require("../asyncHandler");

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { rows } = await pool.query("SELECT * FROM testimonials ORDER BY sort_order ASC, id DESC");
    res.json(rows);
  })
);

router.post(
  "/",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { client_name, message, sort_order } = req.body || {};
    if (!client_name || !message) {
      return res.status(400).json({ error: "client_name and message are required" });
    }
    const { rows } = await pool.query(
      "INSERT INTO testimonials (client_name, message, sort_order) VALUES ($1, $2, $3) RETURNING *",
      [client_name, message, Number(sort_order) || 0]
    );
    res.status(201).json(rows[0]);
  })
);

router.put(
  "/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { rows: existingRows } = await pool.query("SELECT * FROM testimonials WHERE id = $1", [req.params.id]);
    const existing = existingRows[0];
    if (!existing) return res.status(404).json({ error: "Not found" });

    const client_name = req.body.client_name ?? existing.client_name;
    const message = req.body.message ?? existing.message;
    const sort_order = req.body.sort_order !== undefined ? Number(req.body.sort_order) : existing.sort_order;

    const { rows } = await pool.query(
      "UPDATE testimonials SET client_name = $1, message = $2, sort_order = $3 WHERE id = $4 RETURNING *",
      [client_name, message, sort_order, req.params.id]
    );
    res.json(rows[0]);
  })
);

router.delete(
  "/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { rows: existingRows } = await pool.query("SELECT * FROM testimonials WHERE id = $1", [req.params.id]);
    if (!existingRows[0]) return res.status(404).json({ error: "Not found" });
    await pool.query("DELETE FROM testimonials WHERE id = $1", [req.params.id]);
    res.json({ ok: true });
  })
);

module.exports = router;
