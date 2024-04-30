import { Done } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import axiosInstance from "../utils/Axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../utils/ContextProvider";

const CreateGroups = () => {
  const navigate = useNavigate();

  const { refresh, setRefresh } = useContext(Context);

  const createGroup = () => {
    const groupName = document.getElementById("groupName").value;
    if (!groupName) return console.log("Group name is required");

    const token = JSON.parse(localStorage.getItem("userData")).token;

    axiosInstance
      .post(
        "/chat/createGroup",
        { name: groupName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        console.log(res);
        setRefresh(!refresh);
      });

    navigate("/app/groups");
  };

  return (
    <div className="create-groups-container">
      <div>
        <input
          id="groupName"
          type="text"
          placeholder="Enter Group Name"
          className="search-box"
        />
        <IconButton onClick={createGroup}>
          <Done color="success" />
        </IconButton>
      </div>
    </div>
  );
};

export default CreateGroups;
