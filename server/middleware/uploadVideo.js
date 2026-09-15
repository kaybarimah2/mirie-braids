const path = require("path");
const multer = require("multer");

const ALLOWED = new Set([".mp4", ".mov", ".webm", ".m4v"]);

const uploadVideo = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 60 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED.has(ext)) return cb(new Error("Unsupported video type"));
    cb(null, true);
  },
});

module.exports = uploadVideo;
