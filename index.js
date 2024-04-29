import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import connectMongodb from "./db/connectMongodb.js";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoute.js";
import likePostRoutes from "./routes/likePostRoute.js";
import commentRoutes from "./routes/commentRoute.js";
import likeCommentRoutes from "./routes/likeCommentRoute.js";
import followRoutes from "./routes/followRoute.js";
import notificationRoutes from "./routes/notificationRoute.js";
import replyCommentRoutes from "./routes/replyCommentRoute.js";
import messageRoutes from "./routes/chat/messageRoute.js";
import conversationRoutes from "./routes/chat/conversationRoute.js";

dotenv.config();
const app = express();

//config
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

//routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/post", likePostRoutes);
app.use("/api/post", commentRoutes);
app.use("/api/post", likeCommentRoutes);
app.use("/api/post", replyCommentRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/notify", notificationRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/conversation", conversationRoutes);

//envConfig
const PORT = process.env.PORT;

app.listen(PORT, () => {
  connectMongodb();
  console.log(`Server running on port ${PORT}`);
});
