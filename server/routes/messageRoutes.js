const express = require("express");
const router = express.Router();

const {
  sendMessage,
  getMessages,
} = require("../controllers/messageController");

const { isAuthenticated, isAuthorized } = require("../middleware/auth");

router.post("/send", sendMessage);

router.get("/", isAuthenticated, isAuthorized("Admin"), getMessages);

module.exports = router;
