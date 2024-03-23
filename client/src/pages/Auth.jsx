import React, { useState } from 'react'
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom'; 

const Auth = () => {
  return (
    <div className='auth'>

      <Login />
      <Register />

    </div>
  )
}

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [_, setCookies] = useCookies(["access_token"]); // Define the cookie we want to use, only need access to the function that sets the cookie.

  const navigate = useNavigate(); // This is a function that when you call it, it will redirect you to whichever path you put inside.

  const onSubmit = async (event) => {
    event.preventDefaul();
    // Sending back our authentication token.
    // This response should receive everything that is sent back from the API.
    try {
      const response = await axios.post("http://localhost:3001/auth/login", {
        username,
        password
      });
      // Set the token into our Cookies
      setCookies("access_token", response.data.token);
      // After setting the cookie to have that value (token), we want to store our userID that we're sending back inside of our localstorage for quick access.
      window.localStorage.setItem("userID", response.data.userID);
      navigate("/"); // Navigates to Home.
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
    // Not sending anything from this request, just try to create the user.
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

        <h2> {label} </h2>

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

        <button type='submit'> {label} </button>
      </form>
    </div>
  )
}

export default Auth