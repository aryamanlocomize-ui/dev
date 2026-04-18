import dotenv from 'dotenv';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { connectDB } from './config/db.js';
import { createApp } from './app.js';
import { initSocket } from './config/socket.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = createApp();
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: { origin: process.env.CLIENT_URL || '*' }
});

io.on('connection', (socket) => {
  socket.on('join:user', (userId) => socket.join(`user:${userId}`));
  socket.on('join:restaurant', (restaurantId) => socket.join(`restaurant:${restaurantId}`));
  socket.on('join:delivery', (deliveryId) => socket.join(`delivery:${deliveryId}`));
});

initSocket(io);

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect DB', error);
    process.exit(1);
  });
