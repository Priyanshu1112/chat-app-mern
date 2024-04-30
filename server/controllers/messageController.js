const expressAsyncHandler = require("express-async-handler");
const Message = require("../models/messageModel.js");
const User = require("../models/userModel.js");
const Chat = require("../models/chatModel");

//AllMessages
exports.allMessages = expressAsyncHandler(async (req, res, next) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name email")
      .populate("receiver");
    // .populate("chat");

    res.status(200).json(messages);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

//SendMessage
exports.sendMessage = expressAsyncHandler(async (req, res, next) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res.status(400).json({ error: "Content and ChatId is required!" });
  }

  const chat = await Chat.findById(chatId);
  console.log(chat);

  if (!chat) {
    return res.status(404).json({ error: "No chat found" });
  }

  var newMessage = {
    sender: req.id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name");
    message = await message.populate("chat");
    message = await message.populate("receiver");

    message = await User.populate(message, {
      path: "chat.users",
      select: "name email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
    res.status(200).json(message);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});
