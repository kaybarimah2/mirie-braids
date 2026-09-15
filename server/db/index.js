const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS services (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      price_text TEXT NOT NULL,
      image_path TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS testimonials (
      id SERIAL PRIMARY KEY,
      client_name TEXT NOT NULL,
      message TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS video_testimonials (
      id SERIAL PRIMARY KEY,
      video_path TEXT NOT NULL,
      caption TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  // Our backend is the only client that talks to Supabase directly (access is
  // already gated by our own admin JWT check before any upload/delete route
  // runs), so grant full access to the "media" bucket at the RLS layer —
  // otherwise Storage's list/remove calls silently no-op under the project's
  // default policies even though upload/read still work.
  await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'media_bucket_all_access'
      ) THEN
        CREATE POLICY "media_bucket_all_access" ON storage.objects
        FOR ALL
        USING (bucket_id = 'media')
        WITH CHECK (bucket_id = 'media');
      END IF;
    END $$;
  `);
}

module.exports = { pool, init };
