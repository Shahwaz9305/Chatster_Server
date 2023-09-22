const mongoose = require("mongoose");
const Schema = mongoose.Schema; // Added this line

const roomSchema = new Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 255,
    required: true,
  },
  description: {
    type: String,
    minlength: 3,
    required: true,
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
});

const Room = mongoose.model("Rooms", roomSchema);

module.exports = Room;
