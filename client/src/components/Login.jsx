import { Backdrop, Button, CircularProgress, TextField, Typography } from "@mui/material";
import { useState } from "react";
import axiosInstance from "../utils/Axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate()

  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const [registerStatus, setRegisterStatus] = useState('')
  const [loginStatus, setLoginStatus] = useState('')

  const [loginData, setLoginData] = useState({ name: '', password: "" })
  const [registerData, setRegisterData] = useState({ email: '', name: '', password: "" })


  const onChangeLogin = (e) => {
    const { name, value } = e.target

    setLoginData((prevData) => {
      const newState = { ...prevData, [name]: value }
      return newState
    })
  }

  const onChangeRegister = (e) => {
    const { name, value } = e.target

    setRegisterData((prevData) => {
      const newState = { ...prevData, [name]: value }
      return newState
    })
  }

  const handleLogin = async () => {
    try {
      setLoginStatus('')
      setIsLoading(true)
      const res = await axiosInstance.post('/user/login', loginData)
      console.log(res);
      setLoginStatus({ msg: 'success', key: Math.random() })
      navigate('/app/welcome');
      localStorage.setItem('userData', JSON.stringify(res.data))
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      if (error.name == 'AxiosError') {
        setLoginStatus({ msg: error.response.data.error, key: Math.random() })
        console.log(error.response.data);
      }
      else console.log(error);
    }
  }

  const handleRegister = async () => {
    try {
      setRegisterStatus('')
      setIsLoading(true)
      const res = await axiosInstance.post('/user/register', registerData)
      console.log(res);
      setRegisterStatus({ msg: 'success', key: Math.random() })
      navigate('/app/welcome');
      localStorage.setItem('userData', JSON.stringify(res.data))
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      if (error.name == 'AxiosError') {
        setRegisterStatus({ msg: error.response.data.error, key: Math.random() })
        console.log(error.response.data);
      }
      else console.log(error);
    }
  }

  return (
    <div className="login-container">
      <div className="image-container">
        <img src="/logo.png" alt="" className="welcome-logo" />
        <h1>Lets&apos;s Chat</h1>
      </div>
      {isLogin ?

        //LOGIN
        <div className="login-box">
          <p style={{ fontSize: "2vw", padding: "20px" }}>
            Login to your Account
          </p>
          <TextField id="username" name="name" label="Enter User Name" variant="outlined" onChange={onChangeLogin} />
          <TextField
            name="password"
            type="password"
            id="password"
            label="Enter Password"
            variant="outlined" onChange={onChangeLogin}
          />
          {isLoading ? <Backdrop open={isLoading}/> : <Button variant="contained" color="success" disabled={isLoading} onClick={handleLogin}>
            Login
          </Button>}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <p>Don&apos;t have an account?</p>
            <Button color="success" onClick={() => setIsLogin(!isLogin)}>Register</Button>
          </div>
          <Typography variant="caption" sx={{ color: 'red' }}>{loginStatus.msg}</Typography>

        </div> :

        //REGISTER
        <div className="login-box">
          <p style={{ fontSize: "2vw", padding: "20px" }}>
            Register your Account
          </p>
          <TextField id="email" name="email" label="Enter Email" variant="outlined" onChange={onChangeRegister} />
          <TextField id="username" name="name" label="Enter User Name" variant="outlined" onChange={onChangeRegister} />
          <TextField
            name="password"
            type="password"
            id="password"
            label="Enter Password"
            variant="outlined" onChange={onChangeRegister}
          />
          {isLoading ? <Backdrop open={isLoading}/> : <Button variant="contained" color="success" disabled={isLoading} onClick={handleRegister}>
            Register
          </Button>}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <p>Already have an account?</p>
            <Button color="success" onClick={() => setIsLogin(!isLogin)}>Login</Button>
          </div>
          <Typography variant="caption" sx={{ color: 'red' }}>{registerStatus.msg}</Typography>
        </div>
      }
    </div>
  );
};

export default Login;
