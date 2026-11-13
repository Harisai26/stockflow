# StockFlow

A small multi-tenant inventory app built with the MERN stack (MongoDB, Express, React, Node).
Each signup creates its own organization, and all products are scoped to that organization.

## Features

- Sign up / log in (JWT, passwords hashed with bcrypt)
- Product CRUD with SKU unique per organization
- Search by name or SKU
- Quick stock adjust (+/- units)
- Dashboard with total products, total stock and low stock items
- Default low stock threshold in Settings

## Folder structure

```
stockflow/
  server/   Express + MongoDB API
  client/   React + Vite + Tailwind frontend
```

## Running it locally

You need Node 18+ and MongoDB running locally (or a MongoDB Atlas connection string).

### 1. Backend

```bash
cd server
npm install
cp .env.example .env     # then edit the values if needed
npm run dev
```

The API runs on http://localhost:5000

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173. Vite proxies `/api` calls to the backend.

## API routes

| Method | Route                       | What it does                  |
| ------ | --------------------------- | ----------------------------- |
| POST   | /api/auth/signup            | Create account + organization |
| POST   | /api/auth/login             | Log in                        |
| GET    | /api/auth/me                | Current user                  |
| GET    | /api/products?search=       | List products                 |
| POST   | /api/products               | Add product                   |
| PUT    | /api/products/:id           | Update product                |
| PATCH  | /api/products/:id/adjust    | Add/remove units              |
| DELETE | /api/products/:id           | Delete product                |
| GET    | /api/dashboard              | Dashboard numbers             |
| GET    | /api/settings               | Get default threshold         |
| PUT    | /api/settings               | Update default threshold      |

## Low stock rule

A product is low stock when `quantity <= threshold`. If the product has no threshold of its own,
the default from Settings is used (starts at 5).

## Notes

- Delete is a hard delete (with a confirm popup).
- Password reset is not included in this MVP.
