import { Search } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import axiosInstance from "../utils/Axios";
import { useNavigate } from "react-router-dom";
import GroupItem from "./GroupItem";
import { Context } from "../utils/ContextProvider";

const Groups = () => {
  const navigate = useNavigate();

  const [groups, setGroups] = useState([]);

  const [myGroups, setMyGroups] = useState([]);
  const [otherGroups, setOtherGroups] = useState([]);

  const { refresh, setRefresh } = useContext(Context);

  const userData = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    if (!userData) {
      console.log("Unauthenticated user!");
      navigate(-1);
    } else {
      axiosInstance
        .get("/chat/fetchAllGroups", {
          headers: { Authorization: `Bearer ${userData.token}` },
        })
        .then((res) => {
          // console.log(res.data);
          setGroups(res.data);
        });
    }
  }, [refresh]);

  useEffect(() => {
    groups.map((group) => {
      let i;
      for (i = 0; i < group.users.length; i++) {
        if (group.users[i]._id == userData._id)
          return setMyGroups((prevState) => {
            let groupPresent = prevState.some((elem) => elem._id === group._id);
            if (groupPresent) return prevState;
            const newState = [...prevState, group];
            return newState;
          });
      }
      if (i == group.users.length) {
        setOtherGroups((prevState) => {
          let groupPresent = prevState.some((elem) => elem._id === group._id);
          if (groupPresent) return prevState;
          const newState = [...prevState, group];
          return newState;
        });
      }
    });
  }, [groups]);

  const addSelfToGroup = async (chatId) => {
    axiosInstance
      .put(
        "/chat/addSelfToGroup",
        {
          chatId,
          userId: userData._id,
        },
        {
          headers: { Authorization: `Bearer ${userData.token}` },
        }
      )
      .then((res) => {
        if (res.status != 200) return;
        setOtherGroups((prevState) =>
          prevState.filter((group) => group._id !== chatId)
        );
        setRefresh(!refresh);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="list-container">
      <div className="lc-header">
        <img src="/logo.png" alt="" style={{ height: "2vw" }} />
        <p>Available Groups</p>
      </div>
      <div className="sb-search">
        <IconButton>
          <Search />
        </IconButton>
        <input type="text" placeholder="Search" className="search-box" />
      </div>
      <div className="ug-list">
        <div id="my-groups">
          <p
            className="con-title"
            style={{ textAlign: "center", margin: "20px 0px 10px 0px" }}
          >
            My Groups :
          </p>
          {myGroups.map((group, index) => (
            <div
              key={index}
              onClick={() => {
                navigate(`/app/chat/${group._id}&${group.chatName}`);
              }}
            >
              <GroupItem group={group} />
            </div>
          ))}
        </div>
        <div id="other-groups">
          <p
            className="con-title"
            style={{ textAlign: "center", margin: "20px 0px 10px 0px" }}
          >
            Other Groups :
          </p>
          {otherGroups.map((group, index) => (
            <div key={index} onClick={() => addSelfToGroup(group._id)}>
              <GroupItem group={group} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Groups;
