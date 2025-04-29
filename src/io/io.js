import { Server as SocketIOServer } from "socket.io";
import { emitChatHistory, emitChatMessage } from "./events.js";
let io;

export const registerSocketServer = (server) => {
  io = new SocketIOServer(server.server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["Authorization"],
      credentials: true,
    },
    transports: ['websocket', 'polling']
  });

  io.on("connection", (socket) => {
    console.log("New user connected");
    console.log(socket.id);

    socket.on("chat-history", (channelId) => {
      console.log(`Request for chat history on channel: ${channelId}`);
      socket.join(channelId);
      emitChatHistory(socket, channelId);
    });

    socket.on("chat-message", (data) => {
      console.log(`New chat message: ${data.message} to channel: ${data.toChannel}`);
      emitChatMessage(io, { toChannel: data.toChannel, message: data.message });
    });

    socket.on("chat-unsubscribe", (channelId) => {
      console.log(`Unsubscribe from channel: ${channelId}`);
      socket.leave(channelId);
    });

    socket.on("disconnect", (reason) => {
      console.log(`User disconnected: ${reason}`);
    });

    socket.on("connect_error", (error) => {
      console.log(`Connect error: ${error}`);
    });
  });
};

