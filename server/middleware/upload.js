const path = require("path");
const multer = require("multer");

const ALLOWED = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED.has(ext)) return cb(new Error("Unsupported image type"));
    cb(null, true);
  },
});

module.exports = upload;
