import { Server } from "socket.io";
import http from "http";
import express from "express";

import Message from "../models/messageModel.js";
import Conversation from "../models/conversationModel.js";

const app = express();
const server = http.createServer(app); //creating http server and binding express instance
// creating a socket server and binding/combining it with http server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001", // url of frontend or client
    methods: ["GET", "POST"],
  },
});

// this is called in sendMessage controller after saving the message to db (messageController.js file )
export const getRecipientSocketId = (recipientId) => {
  return userSocketMap[recipientId];
};

const userSocketMap = {}; //hashmap with key value pair as {userId: socketId}

io.on("connection", (socket) => {
  console.log("user connected with socket id: ", socket.id);

  //   console.log(socket.handshake.query);
  const userId = socket.handshake.query.userId; // recieved query which was set in frontend file SocketContext.jsx

  if (userId != "undefined") userSocketMap[userId] = socket.id;
  io.emit("getOnlineUsers", Object.keys(userSocketMap)); // sending the array of keys(userIds) to all clients

  // listening markMessagesAsSeen event, being sent from MessageContainer.jsx(frontend). For implementing seen messsages feature
  socket.on("markMessagesAsSeen", async ({ conversationId, userId }) => {
    try {
      await Message.updateMany(
        { conversationId: conversationId, seen: false },
        { $set: { seen: true } }
      );
      await Conversation.updateOne(
        { _id: conversationId },
        { $set: { "lastMessage.seen": true } }
      );

      io.to(userSocketMap[userId]).emit("messagesSeen", { conversationId }); // after updating the seen field in db, sending the event to other user/socketId (to frontend MessageContainer.jsx file)
    } catch (error) {
      console.log(error);
    }
  });

  // if the browser tab is closed // (or) if refreshed it will disconnect and connect again
  socket.on("disconnect", () => {
    console.log("user disconnected");
    delete userSocketMap[userId]; // deletes userid of logged out (closed tab) user from hashmap
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, server, app };
