import { Route, Routes } from "react-router-dom";
import "./App.css";
import MainContainer from "./components/MainContainer";
import Welcome from "./components/Welcome";
import ChatArea from "./components/ChatArea";
import CreateGroups from "./components/CreateGroups";
import Users from "./components/Users";
import Groups from "./components/Groups";
import NotFound from "./components/NotFound";
import Login from "./components/Login";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="app" element={<MainContainer />}>
          <Route path="welcome" element={<Welcome />} />
          <Route path="chat/:id" element={<ChatArea />}></Route>
          <Route path="users" element={<Users />} />
          <Route path="groups" element={<Groups />} />
          <Route path="create-groups" element={<CreateGroups />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
