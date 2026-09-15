# Mirie Braids

Website for Mirie Braids, a home-service hair braiding business in Accra, Ghana. Bookings route straight to WhatsApp; the owner manages services and testimonials herself through a built-in admin dashboard.

## Structure

- `client/` — React + Vite public site and `/admin` dashboard
- `server/` — Express API. Database and file storage both live on [Supabase](https://supabase.com) (Postgres + Storage), so the API itself is stateless and can run anywhere.

## Running locally

**Backend** (first time: seed the database):

```
cd server
npm install
# fill in DATABASE_URL, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY in .env first
npm run seed   # creates tables, the storage bucket, and the admin account
npm run dev    # http://localhost:4000
```

**Frontend:**

```
cd client
npm install
npm run dev    # http://localhost:5173
```

The Vite dev server proxies `/api` to the backend, so just open `http://localhost:5173`.

## Admin access

Go to `http://localhost:5173/admin/login`.

- Username: `mirie`
- Password: set in `server/.env` (`ADMIN_PASSWORD`) — **change this after first login**.

From the dashboard she can add/edit/delete:
- **Services & Pricing** — the style photos shown in the interactive grid, with name + starting price
- **Testimonials** — client quotes
- **Video Testimonials** — customer video clips shown in the autoplay carousel

## Environment variables (backend)

- `DATABASE_URL` — Supabase Postgres connection string
- `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` — for file uploads (Storage). The service role key is server-only, never expose it to the frontend.
- `JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD` — admin auth
- `CLIENT_ORIGIN` — the deployed frontend URL, for CORS

## Notes for going live

- Real photos and social handles are still placeholders — add via the admin panel and by editing the footer links in `client/src/components/Footer.jsx`.
- Since the backend no longer needs local disk, it can run on any Node host — no persistent disk required.
- The WhatsApp number is set in `client/src/utils/whatsapp.js`.
