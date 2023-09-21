const Chat = require("../models/Chat");

// get all chats of on conversation with particualar user
module.exports.getChat = async (req, res, next) => {
  try {
    const { userId, friendId } = req.body;
    const chats = await Chat.find({ sender: userId, receiver: friendId });
    res.send(chats);
  } catch (err) {
    next(err);
  }
};

// posting chats
module.exports.postChat = async (req, res, next) => {
  try {
    const { sender, receiver, content, room, status } = req.body;

    const chat = new Chat({
      sender,
      receiver,
      content,
      room,
      status,
    });

    const savedChat = await chat.save();
    res.send(savedChat);
  } catch (err) {
    next(err);
  }
};

// update chat Status

module.exports.updateChatStatus = async (req, res, next) => {
  try {
    const { chatId, newChatStatus } = req.body;
    const chat = await Chat.findById(chatId);
    chat.status = newChatStatus;
    const updatedChat = await chat.save();
    res.send(updatedChat);
  } catch (err) {
    next(err);
  }
};
