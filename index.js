require("express-async-errors");
require("dotenv").config();

const express = require("express");
const app = express();

const mongoose = require("mongoose");
const cors = require("cors");
const sockets = require("./sockets/socket");
const { errorHandler } = require("./middleware/errorHandler");

// Calling inbuilt midleware
app.use(express.json());

const corsOptions = {
  origin: ["http://localhost:3000"],
  methods: ["GET", "PUT", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Importing controllers
const { home } = require("./controller/homeController");

// Conneting to the database
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("Connected to the MongoDB..."))
  .catch((err) => console.log(err));

// creating Home route
app.get("/", home);

// importing routes
app.use("/api/user", require("./routes/userRoute"));
app.use("/api/chats", require("./routes/chatRoute"));
app.use("/api/decodeToken", require("./routes/decodeTokenRoute"));
app.use("/api/searchUser", require("./routes/searchUserRoute"));

// error Handling for req res pipeline
app.use(errorHandler);

// Intializing Dynamic port
const port = process.env.PORT || 5000;

// Listening on Port
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

// Calling socket connection
sockets(server);
