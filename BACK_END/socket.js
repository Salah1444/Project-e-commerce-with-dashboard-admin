// socket.js
import { Server } from "socket.io";
let io;
const initSocket = (server) => {

  io = new Server(server, {
    cors: { origin: process.env.FRONTEND_URL, credentials: true },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);


    socket.on("join", (userId) => {
      socket.join(userId);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
}
const getIO = () => {
  if (!io) throw new Error("Socket.io non initialisé");
  return io;
}

export  { initSocket, getIO };