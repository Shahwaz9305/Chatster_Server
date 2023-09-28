const express = require("express");
const router = express.Router();
const { decodeToken } = require("../controller/decodeTokenController");

router.post("/", decodeToken);

module.exports = router;
