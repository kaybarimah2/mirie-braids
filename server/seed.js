require("dotenv").config();
const bcrypt = require("bcryptjs");
const db = require("./db");

function seedAdmin() {
  const username = process.env.ADMIN_USERNAME || "mirie";
  const password = process.env.ADMIN_PASSWORD || "MirieBraids2026!";
  const existing = db.prepare("SELECT id FROM admin WHERE username = ?").get(username);
  if (existing) {
    console.log(`Admin "${username}" already exists, skipping.`);
    return;
  }
  const hash = bcrypt.hashSync(password, 10);
  db.prepare("INSERT INTO admin (username, password_hash) VALUES (?, ?)").run(username, hash);
  console.log(`Seeded admin user "${username}" with the password from .env — change it after first login.`);
}

function seedServices() {
  const count = db.prepare("SELECT COUNT(*) AS c FROM services").get().c;
  if (count > 0) {
    console.log("Services already seeded, skipping.");
    return;
  }
  const insert = db.prepare(
    "INSERT INTO services (name, price_text, image_path, sort_order) VALUES (?, ?, ?, ?)"
  );
  const starter = [
    ["Knotless Box Braids", "GH₵150+", null],
    ["Ghanaian Weaving", "GH₵100+", null],
    ["Passion Twists", "GH₵180+", null],
  ];
  starter.forEach(([name, price, image], i) => insert.run(name, price, image, i));
  console.log("Seeded 3 starter services.");
}

seedAdmin();
seedServices();
console.log("Seed complete.");
