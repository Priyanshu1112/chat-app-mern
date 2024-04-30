const MessageOthers = ({ message }) => {
  return (
    <div className="other-message-container">
      <div className="conversation-container">
        <p className="con-icon">{message.sender.name[0]}</p>
        <div className="other-text-content">
          <p className="con-title">{message.sender.name}</p>
          <p className="con-lastMessage">{message.content}</p>
          <div className="self-timeStamp">12:00am</div>
        </div>
      </div>
    </div>
  );
};

export default MessageOthers;
