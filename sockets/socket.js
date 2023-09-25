module.exports = function sockets(server) {
  const socket = require("socket.io");

  const io = socket(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  global.onlineUser = new Map();
  io.on("connection", (socket) => {
    global.chatSocket = socket;

    // On user connect
    socket.on("addUser", (userId) => {
      if (!onlineUser.has(userId)) {
        onlineUser.set(userId, socket.id);
      }
    });

    // Send Message
    socket.on("sendMessage", (data) => {
      const userSocketId = onlineUser.get(data.to);
      const { type, message, timestamp } = data;
      const newData = { type: "receive", message, timestamp };
      if (userSocketId) {
        socket.to(userSocketId).emit("recieveMessage", newData);
      }
    });

    // On disconnect
    socket.on("disconnect", () => {
      // remove from online user Map
      for (let [key, value] of onlineUser.entries()) {
        if (value === socket.id) {
          onlineUser.delete(key);
        }
      }
    });
  });
};
