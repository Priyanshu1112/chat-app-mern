const GroupItem = ({ group }) => {
  return (
    <div className="list-item">
      <p className="con-icon">{group.chatName[0]}</p>
      <p className="con-title">{group.chatName}</p>
    </div>
  );
};

export default GroupItem;
