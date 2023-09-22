const express = require("express");
const router = express.Router();
const {
  registerUser,
  logIn,
  addContact,
  getUser,
  getContacts,
} = require("../controller/userController");

// Register User Route
router.post("/register", registerUser);

// login Route
router.post("/login", logIn);

// Find User By Id
router.get("/getUser", getUser);

// Add Contact Route
router.post("/addContact", addContact);

// Get Contact of the User
router.get("/getContacts", getContacts);

module.exports = router;
