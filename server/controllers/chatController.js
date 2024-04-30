const expressAsyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

// AccessChat
exports.accessChat = expressAsyncHandler(async (req, res, next) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("User Id required!");
    return res.status(400).json({
      message: "User Id required!",
    });
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name email",
  });

  if (isChat.length > 0) {
    return res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );

      return res.status(200).json({ FullChat });
    } catch (err) {
      res.status(400);
      throw new Error(err.message);
    }
  }
});

//FetchChats
exports.fetchChats = expressAsyncHandler(async (req, res, next) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    console.log(error);
  }
});

//CreateGroupChat
exports.createGroupChat = expressAsyncHandler(async (req, res, next) => {
  if (!req.body.name) {
    return res.status(400).send({ message: "Data is insufficient" });
  }

  var users = req.body.users ? JSON.parse(req.body.users) : [];
  console.log("chatController/createGroupChat : ", req);

  const admin = await User.findById(req.id);

  users.push(req.id);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: admin,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: error.message,
    });
  }
});

//CreatePersonalChat
exports.createPersonalChat = expressAsyncHandler(async (req, res, next) => {
  const { senderId, receiverId } = req.body;

  if (!senderId && !receiverId) {
    return res.status(400).send({ message: "Data is insufficient" });
  }

  const sender = await User.findById(senderId);
  const receiver = await User.findById(receiverId);


  const users = [sender, receiver];

  const chat = {
    chatName: receiver.name,
    isGroupChat: false,
    users,
  };

  try {
    const newChat = await Chat.create(chat);
    return res.status(200).json(newChat);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

//FetchGroups
exports.fetchGroups = expressAsyncHandler(async (req, res, next) => {
  const userId = req.id;

  try {
    const groups = await Chat.find({
      isGroupChat: true,
      users: { $in: [userId] },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    res.status(200).json(groups);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//FetchAllGroups
exports.fetchAllGroups = expressAsyncHandler(async (req, res, next) => {
  const userId = req.id;

  try {
    const groups = await Chat.find({
      isGroupChat: true,
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    res.status(200).json(groups);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//GroupExit
exports.groupExit = expressAsyncHandler(async (req, res, next) => {
  const { chatId, userId } = req.body;

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404).json({ error: "Chat not found" });
  } else res.status(200).json(removed);
});

//AddSelfToGroup
exports.addSelfToGroup = expressAsyncHandler(async (req, res, next) => {
  const { chatId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404).json({ error: "Chat not found" });
  } else {
    res.status(200).json({ added });
  }
});
