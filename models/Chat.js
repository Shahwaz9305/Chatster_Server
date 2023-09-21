const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
    },
    status: {
      type: String,
      required: true,
      enum: ["sent", "recieved", "read"],
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chats", chatSchema);
module.exports = Chat;
