var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var usersRouter = require("./routes/users");

require("dotenv").config();

var app = express();

require("mongoose")
  .connect(process.env.MONGO_URI)
  .then((res) => console.log("connected to db"))
  .catch((err) => console.log(err));

app.use(cors());

// const server = require("http").Server(app);
// const io = require("socket.io");
// (server, {
//   config: {
//     origin: "http://localhost/5173",
//   },
// });

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/index", (req, res) => {
  res.send("MERN-CHAT-APP");
});
app.use("/user", usersRouter);
app.use("/chat", require("./routes/chat"));
app.use("/message", require("./routes/message"));

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// // error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   // res.locals.message = err.message;
//   // res.locals.error = req.app.get("env") === "development" ? err : {};

//   // render the error page
//   console.log({
//     status: err.status || 500,
//     message: err.message,
//     stack: err.stack,
//   });
//   res.status(err.status || 500).json({
//     errMessage: err.message,
//   });
// });

const server = app.listen(process.env.PORT || 5000, () => {
  console.log("server listening on port : ", process.env.PORT || 5000);
});

module.exports = app;

// const io = io(ser, {
//   cors: {
//     origin: "http://localhost:5173",
//   },
// });

// io.use((socket, next) => {
//   const username = socket.handshake.auth.username;
//   if (!username) {
//     return next(new Error("invalid username"));
//   }
//   socket.username = username;
//   next();
// });

// socket.on("connection", (socket) => {
//   console.log("socket connection", socket.id);

//   // socket.
// });

const io = require("socket.io")(server, {
  cors: {
    origin: ["http://localhost:5173",'*']
  },
});

io.use((socket, next) => {
  const { id, name } = socket.handshake.auth;
  if (!id && !name) {
    console.log("Id or name not provided");
    return next(new Error("invalid id or name"));
  }
  socket.id = id;
  socket.name = name;
  next();
});

io.on("connection", (socket) => {
  console.log("socket connected ID :", socket.id + ", Name :", socket.name);

  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      name: socket.name,
    });
  }
  socket.emit("users", users);

  socket.broadcast.emit("user connected", {
    userID: socket.id,
    name: socket.name,
  });

  socket.on("join chat", (chatId) => {
    console.log("chat joined : ", chatId);
  });

  socket.on("send message", ({ conversation, message }) => {
    // Emit the private message to the receiver
    // console.log({ conversation, message, socket: socket.id });
    conversation?.users.map((user) => {
      if (user._id == message.sender._id) console.log("sender", user);
      else {
        console.log("sending message");
        socket.to(user._id).emit("new message", message);
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("socket disconnected ID :", socket.id);

    socket.broadcast.emit("user disconnected", {
      userID: socket.id,
      name: socket.name,
    });
  });
});
