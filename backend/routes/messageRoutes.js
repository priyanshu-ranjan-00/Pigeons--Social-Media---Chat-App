import express from "express";
import protectRoute from "../middlewares/protectRoute.js"; //import protectRoute from "../middlewares/protectRoute";// will show error as in package.json it is "type": "module",

import {
  getMessages,
  sendMessage,
  getConversations,
} from "../controllers/messageController.js";

const router = express.Router();

router.get("/conversations", protectRoute, getConversations);
router.get("/:otherUserId", protectRoute, getMessages);
router.post("/", protectRoute, sendMessage);

export default router;
