const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const uploadsDir = require("../uploadsDir");

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`);
  },
});

const ALLOWED = new Set([".mp4", ".mov", ".webm", ".m4v"]);

const uploadVideo = multer({
  storage,
  limits: { fileSize: 60 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED.has(ext)) return cb(new Error("Unsupported video type"));
    cb(null, true);
  },
});

module.exports = uploadVideo;
