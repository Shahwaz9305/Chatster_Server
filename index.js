const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const sockets = require("./sockets/socket");

// Calling inbuilt midleware
app.use(express.json());
app.use(cors());

// Importing controllers
const { home } = require("./controller/homeController");

// importing routes
app.use("/api/chats", require("./routes/chat"));

// Conneting to the database
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("Connected to the MongoDB..."))
  .catch((err) => console.log(err));

// creating Home route
app.get("/", home);

// Intializing Dynamic port
const port = process.env.PORT || 5000;

// Listening on Port
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

// Calling socket connection
sockets(server);
