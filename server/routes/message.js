var express = require("express");

const { protect } = require("../middleware/authMiddleware");
const {
  allMessages,
  sendMessage,
} = require("../controllers/messageController");

var router = express.Router();

router.get("/:chatId", protect, allMessages);
router.post("/", protect, sendMessage);

module.exports = router;
