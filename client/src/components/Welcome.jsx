import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate()
  const userData = JSON.parse(localStorage.getItem('userData'));

 useEffect(()=>{

  if (!userData) {
    console.log('Unauthenticated user!');
    navigate('/')
  }
 }, [])

  return (
    <div className="welcome-container">
      <img src="/logo.png" alt="" className="welcome-logo" />
      <h1>Lets&apos;s Chat</h1>

      <p style={{ marginTop: "30px" }}>
        Hi {userData?.name.toUpperCase()}
      </p>
      <p>
        View and text directly to people present in the chat rooms.
      </p>
    </div>
  );
};

export default Welcome;
