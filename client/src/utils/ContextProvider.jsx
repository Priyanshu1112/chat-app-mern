import { createContext, useState } from "react";

export const Context = createContext();

export const Provider = ({ children }) => {
  const [refresh, setRefresh] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState("");
  const [unreadConversation, setUnreadConversation] = useState([]);

  return (
    <Context.Provider
      value={{
        refresh,
        setRefresh,
        conversations,
        setConversations,
        activeConversation,
        setActiveConversation,
        unreadConversation,
        setUnreadConversation,
      }}
    >
      {children}
    </Context.Provider>
  );
};
