import { Search } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/Axios";
import socket from "../utils/Socket";
import { Context } from "../utils/ContextProvider";

const Users = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const navigate = useNavigate();

  const { conversations, setConversations } = useContext(Context);

  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!userData) {
      console.log("Unauthenticated user!");
      navigate(-1);
    } else {
      axiosInstance
        .get("/user/fetchUsers", {
          headers: { Authorization: `Bearer ${userData.token}` },
        })
        .then((res) => {
          setUsers(res.data.users);
        });
    }

    socket.on("users", (users) => {
      setOnlineUsers(users);
    });

    socket.on("user connected", (user) => {
      setOnlineUsers((prevState) => {
        let userPresent = prevState.some((elem) => elem.userId === user.userId);
        if (userPresent) return prevState;
        const newState = [...prevState, user];
        return newState;
      });
    });

    socket.on("user disconnected", (user) => {
      setOnlineUsers((prevState) => {
        return prevState.filter((elem) => elem.userId !== user.userId);
      });
    });
  }, []);

  const userClicked = (receiverId) => {
    const conversation = conversations.find((conversation) => {
      return (
        !conversation.isGroupChat &&
        conversation.users.length === 2 &&
        conversation.users.some((user) => user._id === userData._id) &&
        conversation.users.some((user) => user._id === receiverId)
      );
    });

    if (conversation) {
      console.log("Conversation found:", conversation);
      navigate("/app/chat/" + conversation._id + "&" + conversation.chatName);
      
    } else {
      console.log("Conversation not found");
      axiosInstance
        .post(
          "/chat/createPersonalChat",
          {
            senderId: userData._id,
            receiverId: receiverId,
          },
          {
            headers: { Authorization: `Bearer ${userData.token}` },
          }
        )
        .then((res) => {
          console.log(res);
          setConversations((prevState) => [...prevState, res.data]);
          navigate("/app/chat/" + res.data._id + "&" + res.data.chatName);
        });
    }
  };

  return (
    <div className="list-container">
      <div className="lc-header">
        <img src="/logo.png" alt="" style={{ height: "2vw" }} />
        <p>Online Users</p>
      </div>
      <div className="sb-search">
        <IconButton>
          <Search />
        </IconButton>
        <input type="text" placeholder="Search" className="search-box" />
      </div>
      <div className="ug-list">
        {users?.map((user, ind) => {
          const isOnline = onlineUsers.some(
            (onlineUser) => onlineUser.name === user.name
          );

          return (
            <div
              key={ind}
              className="list-item"
              onClick={() => userClicked(user._id)}
            >
              <p className="con-icon">{user.name[0]}</p>
              <p className="con-title">{user.name}</p>
              {isOnline ? <p className="online-status">Online</p> : <p className="offline-status">Offline</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Users;
