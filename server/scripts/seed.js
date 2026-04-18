import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../src/config/db.js';
import { User } from '../src/models/User.js';
import { Restaurant } from '../src/models/Restaurant.js';
import { MenuItem } from '../src/models/MenuItem.js';

dotenv.config();

const run = async () => {
  await connectDB();
  await Promise.all([User.deleteMany(), Restaurant.deleteMany(), MenuItem.deleteMany()]);

  const [admin, customer, owner, delivery] = await User.create([
    { name: 'Admin', email: 'admin@example.com', password: 'Password1!', role: 'admin' },
    { name: 'Customer', email: 'customer@example.com', password: 'Password1!', role: 'customer' },
    { name: 'Resto Owner', email: 'owner@example.com', password: 'Password1!', role: 'restaurant' },
    { name: 'Delivery Rider', email: 'delivery@example.com', password: 'Password1!', role: 'delivery' }
  ]);

  const restaurant = await Restaurant.create({
    owner: owner._id,
    name: 'Spice Hub',
    description: 'North Indian comfort food',
    cuisines: ['Indian', 'Punjabi'],
    priceForTwo: 600,
    address: 'Downtown',
    rating: 4.4,
    location: { lat: 28.6139, lng: 77.209 }
  });

  await MenuItem.create([
    { restaurant: restaurant._id, name: 'Paneer Butter Masala', price: 260, category: 'Main Course', isVeg: true },
    { restaurant: restaurant._id, name: 'Tandoori Roti', price: 25, category: 'Bread', isVeg: true }
  ]);

  console.log('Seeded users:', { admin: admin.email, customer: customer.email, delivery: delivery.email });
  await mongoose.disconnect();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
