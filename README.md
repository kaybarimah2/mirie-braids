# Mirie Braids

Website for Mirie Braids, a home-service hair braiding business in Accra, Ghana. Bookings route straight to WhatsApp; the owner manages services and testimonials herself through a built-in admin dashboard.

## Structure

- `client/` — React + Vite public site and `/admin` dashboard
- `server/` — Express API + SQLite (via Node's built-in `node:sqlite`, no native build tools required)

## Running locally

**Backend** (first time: seed the database):

```
cd server
npm install
npm run seed   # creates the admin account + 3 starter styles
npm run dev    # http://localhost:4000
```

**Frontend:**

```
cd client
npm install
npm run dev    # http://localhost:5173
```

The Vite dev server proxies `/api` and `/uploads` to the backend, so just open `http://localhost:5173`.

## Admin access

Go to `http://localhost:5173/admin/login`.

- Username: `mirie`
- Password: set in `server/.env` (`ADMIN_PASSWORD`) — **change this after first login** via a password manager or by updating `.env` and re-seeding on a fresh database.

From the dashboard she can add/edit/delete:
- **Services & Pricing** — the style photos shown in the interactive grid, with name + starting price
- **Testimonials** — client quotes
- **Video Testimonials** — customer video clips shown in the autoplay carousel

## Notes for going live

- Real photos and social handles are still placeholders — add via the admin panel and by editing the footer links in `client/src/components/Footer.jsx`.
- SQLite + local file uploads need a host with persistent disk (e.g. Render) when deployed — a purely serverless host (Vercel functions) won't keep the `.db` file or `uploads/` between requests.
- The WhatsApp number is set in `client/src/utils/whatsapp.js`.
