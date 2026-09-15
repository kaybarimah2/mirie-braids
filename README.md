# Mirie Braids

Website for Mirie Braids, a home-service hair braiding business in Accra, Ghana. Bookings route straight to WhatsApp; the owner manages services and testimonials herself through a built-in admin dashboard.

## Structure

Pure static React app — no backend to host. It talks directly to [Supabase](https://supabase.com) for the database, file storage, and admin authentication, using Row Level Security so the public can read but only the logged-in admin can write.

- `client/` — React + Vite public site and `/admin` dashboard

## Running locally

```
cd client
npm install
npm run dev    # http://localhost:5173
```

`client/.env` needs:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

(The anon key is safe to expose in the frontend — it has no special privileges; Row Level Security on each table decides what it can actually read or write.)

## Admin access

Go to `http://localhost:5173/admin/login`. The admin account is a normal Supabase Auth user (email + password), created once via the Supabase dashboard or Admin API — not a public sign-up flow.

From the dashboard she can add/edit/delete:
- **Services & Pricing** — the style photos shown in the interactive grid, with name + starting price
- **Testimonials** — client quotes
- **Video Testimonials** — customer video clips shown in the autoplay carousel

## Supabase setup (already done for this project, documented for reference)

- Tables `services`, `testimonials`, `video_testimonials` in the `public` schema, each with RLS enabled: public `SELECT`, and `INSERT`/`UPDATE`/`DELETE` restricted to `auth.role() = 'authenticated'`.
- A public Storage bucket named `media`, with the same public-read / authenticated-write policy split on `storage.objects`.
- One Supabase Auth user for the admin login.

## Notes for going live

- Real photos and social handles are still placeholders — add via the admin panel and by editing the footer links in `client/src/components/Footer.jsx`.
- Deploy `client/` as a static site (e.g. Vercel) with the two `VITE_SUPABASE_*` env vars set. No backend hosting needed.
- The WhatsApp number is set in `client/src/utils/whatsapp.js`.
