const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    lowercase: true,
    minlength: 3,
    maxlength: 255,
  },
  firstName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 255,
  },
  avatar: {
    type: String,
    default: "",
  },
  about: {
    type: String,
    default: "Hey there i am using Chatster",
  },
  lastOnline: {
    type: Date,
  },
  rooms: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Rooms",
      default: null,
    },
  ],
  contacts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      default: null,
    },
  ],
});

const User = mongoose.model("Users", userSchema);

module.exports = User;
