import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./myStyles.css";
import { useEffect } from "react";
import socket from "../utils/Socket";

const MainContainer = () => {
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    const connectSocket = () => {
      if (!userData) {
        console.log("Unauthenticated user!");
        navigate(-1);
      } else {
        socket.auth = { id: userData._id, name: userData.name };
        socket.connect();

        socket.onAny((event, ...args) => {
          console.log(event, args);
        });
      }
    };

    connectSocket();

    // Cleanup function
    return () => {
      socket.offAny(); // Remove all event listeners
      socket.disconnect();
    };
  }, [navigate, userData]);

  return (
    <div className="main-container">
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default MainContainer;
