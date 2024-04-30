const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
  try {
    let token = null;
    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(404).json({
        message: "Only authenticated user allowed!",
      });
    }

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

    req.id = verifyToken.id;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errName: error.name,
      errMessage: error.message,
    });
  }
};
