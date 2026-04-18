import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

let socket;

export const useSocket = (onOrderUpdate) => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return undefined;

    socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');

    if (user.role === 'customer') socket.emit('join:user', user.id);
    if (user.role === 'delivery') socket.emit('join:delivery', user.id);

    socket.on('order:update', onOrderUpdate);

    return () => {
      socket?.disconnect();
    };
  }, [user, onOrderUpdate]);
};
