module.exports = function sockets(server) {
  const socket = require("socket.io");

  const io = socket(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`User Connected with id ${socket.id}`);

    socket.on("disconnect", () => {
      console.log("User Disconnected");
    });
  });
};
