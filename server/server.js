require("dotenv").config();
const express = require("express");
const cors = require("cors");
const uploadsDir = require("./uploadsDir");

const app = express();

const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(",").map((o) => o.trim())
  : true;

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use("/uploads", express.static(uploadsDir));

app.use("/api/admin", require("./routes/adminAuth"));
app.use("/api/services", require("./routes/services"));
app.use("/api/testimonials", require("./routes/testimonials"));
app.use("/api/video-testimonials", require("./routes/videoTestimonials"));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Server error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Mirie Braids API running on http://localhost:${PORT}`));
