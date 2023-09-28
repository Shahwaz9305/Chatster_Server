const socket = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");

class ChatServer {
  // Constructor Function
  constructor(server) {
    this.io = socket(server, {
      cors: {
        origin: ["https://admin.socket.io", "http://localhost:3000"],
        credentials: true,
      },
    });
    this.onlineUser = new Map();
    this.setupEvents();

    // Visit this url https://admin.socket.io/#/
    instrument(this.io, { auth: false });
  }

  // Setting up All the events
  setupEvents() {
    this.io.on("connection", (socket) => {
      // On user connect
      socket.on("addUser", (userId) => this.addUser(userId, socket));

      // Send Message
      socket.on("sendMessage", (data) => this.sendMessage(data, socket));

      // online Status
      socket.on("isOnline", (selectedUserId) =>
        this.isOnline(selectedUserId, socket)
      );

      // isTyping
      socket.on("typing", ({ from, to, isTyping }) =>
        this.isTyping({ from, to, isTyping }, socket)
      );

      // On disconnect
      socket.on("disconnect", () => this.disconnect(socket));
    });
  }

  addUser(userId, socket) {
    if (!this.onlineUser.has(userId)) {
      this.onlineUser.set(userId, socket.id);
      this.io.emit("userConnectDisconnect", `connect ${socket.id}`);
    }
  }

  sendMessage(data, socket) {
    const userSocketId = this.onlineUser.get(data.to);
    const { message, timestamp } = data;
    const newData = { type: "receive", message, timestamp };
    if (userSocketId) {
      socket.to(userSocketId).emit("recieveMessage", newData);
    }
  }

  isOnline(selectedUserId, socket) {
    if (this.onlineUser.has(selectedUserId)) {
      socket.emit("online", "online");
    } else {
      socket.emit("online", "");
    }
  }

  isTyping({ from, to, isTyping }, socket) {
    const userId = this.onlineUser.get(to);
    socket
      .to(userId)
      .emit("isTyping", { currentSelectedUser: from, isTyping: isTyping });
  }

  disconnect(socket) {
    for (let [key, value] of this.onlineUser.entries()) {
      if (value === socket.id) {
        this.onlineUser.delete(key);
      }
    }
    this.io.emit("userConnectDisconnect", `disconnect ${socket.id}`);
  }
}

module.exports = function sockets(server) {
  new ChatServer(server);
};
