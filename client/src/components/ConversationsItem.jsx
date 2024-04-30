import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../utils/ContextProvider";

const ConversationsItem = ({ conversation }) => {
  const navigate = useNavigate();
  const { unreadConversation } = useContext(Context);

  const [isUnread, setIsUnread] = useState(false);
  const [latestMessage, setLatestMessage] = useState("");

  useEffect(() => {
    const foundConversation = unreadConversation.find(
      (con) => con.chatId === conversation._id
    );

    setIsUnread(!!foundConversation);
    setLatestMessage(foundConversation?.message || "");
  }, [unreadConversation, conversation._id]);

  useEffect(() => {
    const foundConversation = unreadConversation.find(
      (con) => con.chatId === conversation._id
    );

    if (isUnread)
      console.log({
        isUnread,
        latestMessage,
        id: conversation._id,
        foundConversation,
      });
  }, [unreadConversation]);

  return (
    <div
      onClick={() => {
        navigate("chat/" + conversation._id + "&" + conversation.chatName);
      }}
      className={`conversation-container conversation-container-hover ${
        isUnread ? "unread" : ""
      } `}
    >
      <p className="con-icon">{conversation.chatName[0]}</p>
      <p className="con-title">{conversation.chatName}</p>
      <p className="con-lastMessage">
        {isUnread
          ? latestMessage
          : conversation.latestMessage?.content || conversation.latestMessage}
      </p>
      <p className="con-timeStamp">{conversation.timeStamp}</p>
    </div>
  );
};

export default ConversationsItem;
