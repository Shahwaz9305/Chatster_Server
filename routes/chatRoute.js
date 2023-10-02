const express = require("express");
const router = express.Router();
const {
  getChat,
  postChat,
  updateChatStatus,
  getLastChat,
} = require("../controller/chatController");

// get all chats of on conversation with particualar user
router.get("/:userId/:friendId", getChat);

// posting chat to the database
router.post("/", postChat);

// update chat Status
router.put("/", updateChatStatus);

// get Last chat
router.get("/getLastChat/:userId/:friendId", getLastChat);

module.exports = router;
