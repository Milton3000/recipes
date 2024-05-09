import React, { useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  return (
    <div className='auth' style={{ backgroundImage: `url('/bg.jpg')`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed', minHeight: '100vh' }}>
      <div className="container">
        <div className="row justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
          <div className="col-md-6 d-flex justify-content-center align-items-center"> 
            <div className='auth-forms bg-white rounded' style={{ opacity: '0.7', width: '80%' }}>
              <Login />
              <Register />
            </div>
          </div>
          <div className="col-md-0">
          </div>
        </div>
      </div>
    </div>
  );
};





const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [_, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/auth/login", {
        username,
        password
      });
      if (response.data.message === "User Doesn't Exist.") {
        alert("User doesn't exist. Please register first.");
        return;
      } else if (response.data.message === "Username or Password Is Incorrect") {
        alert("Username or password is incorrect. Please try again.");
        return;
      }
      setCookies("access_token", response.data.token);
      window.localStorage.setItem("userID", response.data.userID);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      label="Login"
      onSubmit={onSubmit}
    />
  );
};

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:3001/auth/register", { username, password });
      alert("Registration Completed! Now, login.");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      label="Register"
      onSubmit={onSubmit}
    />
  );
};

const Form = ({ username, setUsername, password, setPassword, label, onSubmit }) => {
  return (
    <div className='auth-container'>
      <form onSubmit={onSubmit}>
        <h2>{label}</h2>
        <div className='form-group'>
          <label htmlFor='username'>
            Username:
          </label>
          <input type='text' id='username' value={username} onChange={(event => setUsername(event.target.value))} />
        </div>
        <div className='form-group'>
          <label htmlFor='password'>
            Password:
          </label>
          <input type='password' id='password' value={password} onChange={(event => setPassword(event.target.value))} />
        </div>
        <button type='submit'>{label}</button>
      </form>
    </div>
  );
};

export default Auth;
