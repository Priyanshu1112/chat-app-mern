var express = require("express");

const { protect } = require("../middleware/authMiddleware");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  fetchGroups,
  groupExit,
  addSelfToGroup,
  fetchAllGroups,
  createPersonalChat,
} = require("../controllers/chatController");
var router = express.Router();

router.post("/", protect, accessChat);
router.get("/", protect, fetchChats);
router.post("/createGroup", protect, createGroupChat);
router.post("/createPersonalChat", protect, createPersonalChat);
router.get("/fetchGroups", protect, fetchGroups);
router.get("/fetchAllGroups", protect, fetchAllGroups);
router.put("/groupExit", protect, groupExit);
router.put("/addSelfToGroup", protect, addSelfToGroup);

module.exports = router;
