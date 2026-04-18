let io;

export const initSocket = (server) => {
  io = server;
};

export const getIO = () => {
  if (!io) return null;
  return io;
};
