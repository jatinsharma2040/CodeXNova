# CodeXNova

Premium engineering & technology education platform.

**Tagline:** Learn. Build. Innovate.

## Stack

- **Client:** React, Vite, TypeScript, Tailwind CSS, React Router, TanStack Query, Framer Motion, React Hook Form, Zod
- **Server:** Node.js, Express, MongoDB, Mongoose, JWT (HTTP-only cookies), Argon2, Zod, Helmet, rate limiting
- **Tooling:** ESLint, Prettier, dotenv, npm workspaces

## Getting started

```bash
# From repo root
cp .env.example .env
cp .env.example client/.env
# Copy server vars into server/.env (see .env.example)

npm install
```

Ensure MongoDB is running, then seed:

```bash
npm run seed
npm run dev
```

- Site: http://localhost:5173
- API health: http://localhost:5000/api/health
- Admin: http://localhost:5173/admin/login

### Default seed admin (change immediately)

- Email: `superadmin@codexnova.local`
- Password: `ChangeMe_Now_123!`

Override with `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD` before seeding.

## Notes

- Contact, WhatsApp, and analytics IDs are environment placeholders — no fake production details.
- Testimonials and faculty credentials are editable placeholders — do not invent partnerships or placement %.
- Enrolment stores `paymentStatus: pending` so Razorpay/Stripe can be added later.
- Public pages fall back to local catalogue content if the API is unreachable.
