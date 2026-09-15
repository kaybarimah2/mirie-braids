require("dotenv").config();
const bcrypt = require("bcryptjs");
const { pool, init } = require("./db");
const { ensureBucket } = require("./storage");

async function seedAdmin() {
  const username = process.env.ADMIN_USERNAME || "mirie";
  const password = process.env.ADMIN_PASSWORD || "MirieBraids2026!";
  const { rows } = await pool.query("SELECT id FROM admin WHERE username = $1", [username]);
  if (rows[0]) {
    console.log(`Admin "${username}" already exists, skipping.`);
    return;
  }
  const hash = bcrypt.hashSync(password, 10);
  await pool.query("INSERT INTO admin (username, password_hash) VALUES ($1, $2)", [username, hash]);
  console.log(`Seeded admin user "${username}" with the password from .env — change it after first login.`);
}

(async () => {
  await init();
  await ensureBucket();
  await seedAdmin();
  console.log("Seed complete.");
  await pool.end();
})().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
