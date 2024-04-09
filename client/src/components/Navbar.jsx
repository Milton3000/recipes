import React from 'react'
import { Link } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { useNavigate} from 'react-router-dom';

const Navbar = () => {

const [cookies, setCookies] = useCookies(["access_token"]);
const navigate = useNavigate();

// Setting the access_token to be an empty cookie
// Then we clear the localStorage from userID4
// Then Navigate to our Auth page. 

const logout = () => {
  setCookies("access_token", "")
  window.localStorage.removeItem("userID");
  navigate("/auth");
}
  return (
    <div className='navbar'>

        <Link to="/"> Home </Link>
        <Link to="/createrecipe"> Create Recipe </Link>
        {!cookies.access_token ? (<Link to="/auth"> Login/Register</Link>) : ( 
        <>
        <Link to="/savedrecipes"> Saved Recipes </Link>
        <button onClick={logout}> Logout </button>
        </>
        )}
    </div>
  );
}

// If there is no cookies.access_token it means that you are not logged in, so that means we show the <Link> for logging in, but if there is, it means you are already logged in and then we show a "Logout" Button.

export default Navbar