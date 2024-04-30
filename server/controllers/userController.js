const generateToken = require("../config/generateToken");
const User = require("../models/userModel");
const expressAsyncHandler = require("express-async-handler");

// LOGIN
exports.loginController = expressAsyncHandler(async (req, res, next) => {
  const { name, password } = req.body;

  if (!name && !password) {
    return res.status(400).json({
      error: "All necessary input fields are required",
    });
  }

  const user = await User.findOne({ name });
  if (!user) return res.status(404).json({ error: "Username not registered!" });

  const isMatch = await user.comparePassword(password);

  if (!isMatch) return res.status(404).json({ error: "Incorrect password!" });

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: generateToken(user._id),
  });
});

// REGISTER
exports.registerController = expressAsyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name && !email && !password) {
    return res.status(400).json({
      error: "All necessary input fields are required",
    });
  }

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return res.status(400).json({
      error: "Email already registered!",
    });
  }

  const existingUsername = await User.findOne({ name });
  if (existingUsername) {
    return res.status(400).json({
      error: "Username in use!",
    });
  }

  const newUser = await User.create({ email, name, password });

  if (newUser)
    res.status(200).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      token: generateToken(newUser._id),
    });
  else res.status(500).json({ error: "Unable to create new user!" });
});

exports.fetchAllUsersController = expressAsyncHandler(
  async (req, res, next) => {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(keyword).find({
      _id: { $ne: req.id },
    });

    res.status(200).json({
      users,
    });
  }
);
