# PC Online Shop

Full-stack e-commerce demo for PC components (catalog, cart, checkout, orders, Stripe payment).

**Demo:** https://www.jerryng.site/

Update: Remove register account, delete brand, categroy, product...

---

## Tech stack

| Layer | Technology |
|--------|------------|
| Frontend | Next.js, React, TypeScript, MUI, SWR |
| Backend | Django, Django REST Framework, Simple JWT |
| Database | PostgreSQL |
| Payment | Stripe (Checkout + Webhook) |
| Deploy | Ubuntu VPS, Nginx, Gunicorn, systemd, GitHub Actions |
| Ops | Cron job for expiring pending orders (>24h) |

---

## Features

- Product list / detail, search
- Cart, create order (stock reserved on order create)
- Stripe payment; order status updated via return URL + webhook
- Cancel pending order (release stock)
- Auto-expire pending orders after 24 hours (release stock)
- JWT auth (access + refresh)

---

## Project structure

```text
backend/     # Django + DRF
frontend/    # Next.js
