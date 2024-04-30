import { Delete, Send } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import axiosInstance from "../utils/Axios";
import MessageSelf from "./MessageSelf";
import MessageOthers from "./MessageOthers";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import socket from "../utils/Socket";
import { Context } from "../utils/ContextProvider";

const ChatArea = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const [chatId, chatName] = id.split("&");

  const {
    conversations,
    activeConversation,
    setActiveConversation,
    setUnreadConversation,
  } = useContext(Context);

  const [allMessages, setAllMessages] = useState([]);

  const userData = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    socket.on("new message", (message) => {
      console.log("message received :", message);
      if (message.chat._id == chatId) {
        console.log(message.chat._id == chatId);
        setAllMessages((prevState) => {
          if (prevState.some((msg) => msg._id === message._id)) {
            return prevState; // Skip adding the message again
          }
          return [...prevState, message];
        });
      } else {
        const unread = { chatId: message.chat._id, message: message.content };

        console.log("different chat", unread);
        setUnreadConversation((prevState) => {
          if (prevState.some((item) => item.chatId === message.chat._id)) {
            // If the chatId already exists in unreadConversation, return prevState
            return prevState;
          } else {
            // If the chatId does not exist, add the unread object to prevState
            return [...prevState, unread];
          }
        });
      }
    });
  }, []);

  useEffect(() => {
    console.log(activeConversation);

    setUnreadConversation((prevState) => {
      return prevState.filter((item) => item.chatId !== chatId);
    });

    setActiveConversation(() => {
      return conversations.find((conversation) => conversation._id === chatId);
    });
  }, [chatId]);

  // useEffect(() => {
  //   console.log(activeConversation);
  // }, [activeConversation]);

  useEffect(() => {
    if (!userData) {
      console.log("Unauthenticated user!");
      navigate(-1);
    } else {
      axiosInstance
        .get(`/message/${chatId}`, {
          headers: { Authorization: `Bearer ${userData.token}` },
        })
        .then((res) => {
          // console.log(res.data);
          setAllMessages(res.data);
        });
      socket.emit("join chat", chatId);
    }

    return () => setActiveConversation("");
  }, [chatName]);

  useEffect(() => {
    const scrollToBottom = () => {
      const messageContainer = document.getElementById("messageContainer");
      // messageContainer.scrollTo(0, messageContainer.scrollHeight);
      messageContainer.scrollTop =
        messageContainer.scrollHeight - messageContainer.clientHeight;
    };

    scrollToBottom();
  }, [allMessages]);

  const sendMessage = () => {
    const content = document.getElementById("message").value;

    if (!content) return console.log("empty message!");

    axiosInstance
      .post(
        "/message",
        {
          content,
          chatId,
        },
        {
          headers: { Authorization: `Bearer ${userData.token}` },
        }
      )
      .then((res) => {
        console.log(res);
        setAllMessages((prevState) => [...prevState, res.data]);
        console.log(activeConversation);
        socket.emit("send message", {
          conversation: activeConversation,
          message: res.data,
        });
      });

    document.getElementById("message").value = "";
  };

  return (
    <div className="chatArea-container">
      <div className="chatArea-header">
        <p className="con-icon">{chatName[0]}</p>
        <div className="header-text">
          <p className="con-title">{chatName}</p>
          <p className="con-timeStamp">today</p>
        </div>
        <IconButton>
          <Delete />
        </IconButton>
      </div>
      <div className="messages-container" id="messageContainer">
        {allMessages.map((message, index) => {
          if (userData._id == message.sender._id) {
            return <MessageSelf key={index} message={message} />;
          } else {
            return <MessageOthers key={index} message={message} />;
          }
        })}
      </div>
      <div className="text-input-area">
        <input
          autoComplete="off"
          onKeyDown={(e) => {
            e.code == "Enter" && document.getElementById("send").click();
          }}
          id="message"
          type="text"
          placeholder="Type a Message"
          className="search-box"
        />
        <IconButton id="send" onClick={sendMessage}>
          <Send />
        </IconButton>
      </div>
    </div>
  );
};

export default ChatArea;
