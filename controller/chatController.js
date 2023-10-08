const { renameSync } = require("fs");
const {
  Chat,
  validatePostChatRequest,
  validateImagePostChatRequest,
} = require("../models/Chat");

// get all chats of on conversation with particualar user
module.exports.getChat = async (req, res) => {
  const { userId, friendId } = req.params;
  const chats = await Chat.find({
    $or: [
      { sender: userId, receiver: friendId },
      { receiver: userId, sender: friendId },
    ],
  });

  const modifedChats = chats.map((chat) => {
    return {
      type: chat.sender.equals(userId) ? "send" : "receive",
      message: chat.content,
      timestamp: chat.createdAt,
      contentType: chat.contentType,
    };
  });
  res.status(200).send(modifedChats);
};

// posting chats
module.exports.postChat = async (req, res) => {
  const { error } = validatePostChatRequest(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { sender, receiver, content, room, status, contentType } = req.body;

  const chat = new Chat({
    sender,
    receiver,
    content,
    room,
    status,
    contentType,
  });

  const savedChat = await chat.save();
  res.status(201).send(savedChat);
};

// update chat Status

module.exports.updateChatStatus = async (req, res) => {
  const { chatId, newChatStatus } = req.body;
  const chat = await Chat.findById(chatId);
  chat.status = newChatStatus;
  const updatedChat = await chat.save();
  res.send(updatedChat);
};

// Add image message

module.exports.addImageMessage = async (req, res, next) => {
  const { error } = validateImagePostChatRequest(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { sender, receiver, room, status, contentType } = req.body;
  let filename = "";
  if (req.file) {
    const date = Date.now();
    filename = "uploads/images/" + date + req.file.originalname;
    renameSync(req.file.path, filename);
  } else {
    res.status(400).send("Image is Required");
  }

  const chat = new Chat({
    sender,
    receiver,
    content: filename,
    room,
    status,
    contentType,
  });

  const savedChat = await chat.save();

  res.status(201).send(savedChat);
};
