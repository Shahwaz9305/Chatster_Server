const mongoose = require("mongoose");
const Joi = require("joi");

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
      default: "",
    },
  },
  { timestamps: true }
);

module.exports.Chat = mongoose.model("Chats", chatSchema);

// Functions for validating chat routes

// validating post chat request
module.exports.validatePostChatRequest = (data) => {
  const schema = Joi.object({
    sender: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        "string.empty": "Sender ID cannot be empty",
        "string.pattern.base": "Sender ID must be a valid MongoDB ObjectId",
      }),

    receiver: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        "string.empty": "Receiver ID cannot be empty",
        "string.pattern.base": "Receiver ID must be a valid MongoDB ObjectId",
      }),

    content: Joi.string().required().messages({
      "string.empty": "Content cannot be empty",
    }),

    room: Joi.array()
      .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
      .messages({
        "array.base": "Room must be an array of MongoDB ObjectIds",
      }),

    status: Joi.string().valid("sent", "recieved", "read").messages({
      "any.only": 'Status must be one of "send", "received", or "read"',
    }),
  });

  return schema.validate(data);
};
