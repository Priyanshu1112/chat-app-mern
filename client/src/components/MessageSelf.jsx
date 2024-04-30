const MessageSelf = ({message}) => {
  return (
    <div className="self-message-container">
      <div className="messageBox">
        <p className="con-lastMessage">{message.content}</p>
        <p className="self-timeStamp">12:00am</p>
      </div>
    </div>
  );
};

export default MessageSelf;
