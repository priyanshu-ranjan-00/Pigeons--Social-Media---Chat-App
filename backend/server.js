import path from "path";

import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { v2 as cloudinary } from "cloudinary"; // for storing images such as profile picture
import { app, server } from "./socket/socket.js";

dotenv.config();

connectDB();

// const app = express(); // no need further as app is imported form socket.js

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// connecting to cloudinary account
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middlewares
app.use(express.json({ limit: "50mb" })); // to parse JSON data in req.body // include limit to avoid error of large payload
app.use(express.urlencoded({ extended: true })); // to parse form data in req.body
app.use(cookieParser());

//Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);

// for deployment
// http:localhost:3000 --> backend // http:localhost:3001 --> frontend // now, we have to put both on the same url to avoid cors error (i.e., at 3000)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  // if we hit any other route other than above 3 api routes, react app will be served (i.e., frontend file)
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

// instead of listening express app, http server will be there
server.listen(PORT, () => {
  console.log(`Express Server is running at http://localhost:${PORT}`);
});
