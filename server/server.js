require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { init } = require("./db");
const { ensureBucket } = require("./storage");

const app = express();

const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(",").map((o) => o.trim())
  : true;

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.use("/api/admin", require("./routes/adminAuth"));
app.use("/api/services", require("./routes/services"));
app.use("/api/testimonials", require("./routes/testimonials"));
app.use("/api/video-testimonials", require("./routes/videoTestimonials"));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Server error" });
});

const PORT = process.env.PORT || 4000;

(async () => {
  await init();
  await ensureBucket();
  app.listen(PORT, () => console.log(`Mirie Braids API running on http://localhost:${PORT}`));
})().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
