const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  getChat,
  postChat,
  updateChatStatus,
  addImageMessage,
} = require("../controller/chatController");
const uploadImage = multer({ dest: "uploads/images" });

// get all chats of on conversation with particualar user
router.get("/:userId/:friendId", getChat);

// posting chat to the database
router.post("/", postChat);

// update chat Status
router.put("/", updateChatStatus);

// add image Message
router.post("/addImageMessage", uploadImage.single("image"), addImageMessage);

module.exports = router;
