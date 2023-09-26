const express = require("express");
const router = express.Router();
const { searchUser } = require("../controller/searchUserController");

router.get("/:contactName/:userName", searchUser);

module.exports = router;
