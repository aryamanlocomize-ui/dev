# Zomato-like Food Delivery MVP

Production-ready MVP with a multi-role marketplace architecture:
- Customer ordering flow
- Restaurant operations flow
- Delivery partner logistics flow
- Admin control/analytics flow

## 1) Architecture (Brief)

### High-level architecture
- **Client (`/client`)**: React + Vite + Tailwind web app using Axios for REST API integration.
- **Server (`/server`)**: Node.js + Express + Mongoose with MVC modules (`controllers`, `models`, `routes`, `middleware`, `services`).
- **Data layer**: MongoDB for marketplace entities.
- **Auth**: JWT + role-based authorization middleware.
- **Realtime**: Socket.io events for order updates and delivery tracking hooks.

### Core design principles
- Modular boundaries by business domain.
- Role-scoped endpoints and guards.
- Order lifecycle and status history.
- Error handling and consistent status codes.
- Environment-driven configuration (`.env`).

---

## 2) Folder Structure

```bash
.
├── client
│   ├── public
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   ├── context
│   │   ├── hooks
│   │   ├── layouts
│   │   ├── pages
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
└── server
    ├── scripts
    │   └── seed.js
    ├── src
    │   ├── config
    │   ├── controllers
    │   ├── middleware
    │   ├── models
    │   ├── routes
    │   ├── services
    │   ├── utils
    │   ├── app.js
    │   └── index.js
    ├── .env.example
    ├── Dockerfile
    └── package.json
```

---

## 3) Backend Code Summary (MVC)

### Models (`server/src/models`)
- `User`: name/email/password/role/location.
- `Restaurant`: owner, cuisines, rating, price, geo metadata.
- `MenuItem`: per-restaurant menu catalog.
- `Order`: lifecycle status, items, payment fields, assignment, history.
- `Review`: customer feedback per restaurant.

### Controllers (`server/src/controllers`)
- `authController`: register/login/me.
- `restaurantController`: listing, filters, details with menu/reviews, registration.
- `menuController`: restaurant/admin menu CRUD.
- `orderController`: place order, fetch role-specific orders, assign delivery, status transitions.
- `reviewController`: upsert review + rating recomputation.
- `adminController`: users/restaurants/analytics.

### Middleware (`server/src/middleware`)
- `authMiddleware`: `protect` + `authorize(...roles)`.
- `errorMiddleware`: `notFound` + centralized `errorHandler`.

### Services (`server/src/services`)
- `tokenService`: JWT token generation.
- `orderService`: cart validation and billing math.

---

## 4) Frontend Code Summary

### Key screens
- Home
- Restaurant listing + search/cuisine filter
- Restaurant details + menu add-to-cart
- Cart + checkout
- Orders with role actions and live updates
- Profile
- Admin analytics
- Login/Register

### State management
- `AuthContext`: JWT session and user role management.
- `CartContext`: cart operations and total price.
- `useSocket`: listens for `order:update` events.

### API integration
- Axios instance with auth interceptor (`Authorization: Bearer <token>`).

---

## 5) API Routes

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Restaurants & Menu
- `GET /api/restaurants`
- `GET /api/restaurants/:id`
- `POST /api/restaurants` (restaurant/admin)
- `POST /api/restaurants/:restaurantId/reviews` (customer)
- `POST /api/menu/:restaurantId` (restaurant/admin)
- `PUT /api/menu/item/:id` (restaurant/admin)
- `DELETE /api/menu/item/:id` (restaurant/admin)

### Orders
- `POST /api/orders` (customer)
- `GET /api/orders/my` (all roles with scoped filters)
- `PATCH /api/orders/:id/status` (restaurant/delivery/admin)
- `PATCH /api/orders/:id/assign` (admin)

### Admin
- `GET /api/admin/users`
- `GET /api/admin/restaurants`
- `GET /api/admin/analytics`

---

## 6) Database Schemas & Relationships

### Collections
- `users`
- `restaurants`
- `menuitems`
- `orders`
- `reviews`

### Relationships
- One restaurant ➜ many menu items (`MenuItem.restaurant`).
- One user (customer) ➜ many orders (`Order.customer`).
- One order ➜ one delivery partner (`Order.deliveryPartner`).
- One restaurant ➜ many reviews (`Review.restaurant`).

---

## 7) Setup Instructions

## Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Backend setup
```bash
cd server
cp .env.example .env
npm install
npm run dev
```

### Optional: seed test data
```bash
cd server
npm run seed
```

### Frontend setup
```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Client: `http://localhost:5173`  
Server: `http://localhost:5000`

---

## 8) Sample `.env`

### Server (`server/.env`)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/zomato_mvp
JWT_SECRET=replace_with_secure_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### Client (`client/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## 9) Edge Cases Implemented
- Empty cart order blocked.
- Invalid login credentials rejected.
- Invalid role/state transitions blocked.
- Multi-restaurant cart blocked server-side.
- Unavailable menu item ordering blocked.

---

## 10) Deployment Notes (Bonus)

### Docker backend
```bash
cd server
docker build -t zomato-mvp-server .
docker run --env-file .env -p 5000:5000 zomato-mvp-server
```

### Cloud deployment
- **Frontend**: Vercel/Netlify.
- **Backend**: Render/Railway/AWS ECS.
- **Database**: MongoDB Atlas.
- Set all env variables in deployment platform settings.

