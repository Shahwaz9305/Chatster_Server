const express = require("express");
const router = express.Router();
const {
  getChat,
  postChat,
  updateChatStatus,
} = require("../controller/chatController");
const Chat = require("../models/Chat");
const mongoose = require("mongoose");

// get all chats of on conversation with particualar user
router.get("/", getChat);

// posting chat to the database
router.post("/", postChat);

// update chat Status
router.put("/", updateChatStatus);

module.exports = router;
