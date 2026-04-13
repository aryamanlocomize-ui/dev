# Service Marketplace Backend (Urban Company-style)

Production-ready backend API for a service marketplace app using **Node.js**, **Express**, **PostgreSQL**, and **MVC architecture**.

## Tech Stack

- Node.js
- Express.js
- PostgreSQL (`pg`)
- JWT authentication
- BCrypt password hashing

## Project Structure

```bash
.
├── src
│   ├── config
│   ├── controllers
│   ├── middlewares
│   ├── models
│   ├── routes
│   ├── utils
│   ├── app.js
│   └── server.js
├── sql
│   └── schema.sql
├── .env.example
└── package.json
```

## Setup Instructions

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

```bash
cp .env.example .env
```

Update `.env` values as per your local PostgreSQL setup.

### 3) Create PostgreSQL database and tables

```bash
createdb service_marketplace
psql -d service_marketplace -f sql/schema.sql
```

### 4) Run the app

```bash
npm run dev
```

Server starts at: `http://localhost:5000`

Health check: `GET /health`

## API Endpoints

### Auth (`/api/auth`)

- `POST /register` - Register user (`customer`/`provider`)
- `POST /login` - Login and get JWT token

### Services (`/api/services`)

- `GET /` - Get all services
- `GET /?category=cleaning` - Filter by category
- `POST /` - Add service (requires `provider` or `admin` JWT)

### Bookings (`/api/bookings`)

- `POST /` - Create booking (authenticated user)
- `GET /my` - View current user bookings
- `PATCH /:id/status` - Update booking status (`provider`/`admin`)

## Notes on Production Practices

- Uses modular MVC architecture.
- Centralized error handling middleware.
- Async/await everywhere with reusable async wrapper.
- JWT-based route protection and role-based authorization.
- Password hashing with bcrypt.
- SQL constraints + indexes for data integrity and performance.

## Sample Request Payloads

### Register

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password@123",
  "role": "customer"
}
```

### Login

```json
{
  "email": "john@example.com",
  "password": "Password@123"
}
```

### Create Service

```json
{
  "name": "Deep Home Cleaning",
  "category": "cleaning",
  "price": 1299
}
```

### Create Booking

```json
{
  "serviceId": 1,
  "date": "2026-05-01T10:30:00.000Z"
}
```
