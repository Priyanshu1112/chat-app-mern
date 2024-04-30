import {
  AccountCircle,
  AddCircle,
  GroupAdd,
  Logout,
  PersonAdd,
  Search,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";
import ConversationsItem from "./ConversationsItem";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import axiosInstance from "../utils/Axios";
import { Context } from "../utils/ContextProvider";

const Sidebar = () => {
  const navigate = useNavigate();
  const { refresh, conversations, setConversations, unreadConversation } =
    useContext(Context);

    console.log(typeof conversations);

  const userData = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    const updatedConversations = conversations.map((conversation) => {
      // Find the unread conversation that matches the current conversation ID
      const foundConversation = unreadConversation.find(
        (con) => con.chatId === conversation._id
      );

      // If a matching unread conversation is found, update the latest message content
      if (foundConversation) {
        // Update the latest message content of the current conversation
        conversation.latestMessage.content = foundConversation.message;
      }

      return conversation;
    });

    // Update the state with the modified conversations
    // conversations == updatedConversations &&
    setConversations(updatedConversations);
  }, [unreadConversation]);

  useEffect(() => {
    if (!userData) {
      console.log("Unauthenticated user!");
      navigate(-1);
    } else {
      axiosInstance
        .get("/chat", {
          headers: { Authorization: `Bearer ${userData.token}` },
        })
        .then((res) => {
          console.log({conversations: res.data});
          setConversations(res.data);
        });
    }
  }, [refresh]);

  return (
    <div className="sidebar-container">
      <div className="sb-header">
        <div>
          <IconButton>
            <AccountCircle fontSize="large" /> <span style={{fontSize : '1.5rem', marginLeft : '1rem'}}>{userData.name}</span>
          </IconButton>
        </div>
        <div>
          <IconButton onClick={() => navigate("users")}>
            <PersonAdd />
          </IconButton>
          <IconButton onClick={() => navigate("groups")}>
            <GroupAdd />
          </IconButton>
          <IconButton onClick={() => navigate("create-groups")}>
            <AddCircle />
          </IconButton>
          <IconButton
            onClick={() => {
              localStorage.removeItem("userData");
              navigate("/");
            }}
          >
            <Logout />
          </IconButton>
        </div>
      </div>
      <div className="sb-search">
        <IconButton>
          <Search />
        </IconButton>
        <input type="text" placeholder="Search" className="search-box" />
      </div>
      <div className="sb-conversations">
        {conversations && conversations?.map((conversation, ind) => {
          if (!conversation.isGroupChat) {
            conversation.users.map((user) => {
              if (user._id != userData._id) {
                conversation.chatName = user.name;
              }
            });
          }

          if (conversation.latestMessage == undefined) {
            conversation.latestMessage = "No messages";
          }
          return <ConversationsItem key={ind} conversation={conversation} />;
        })}
      </div>
    </div>
  );
};

export default Sidebar;
