import React from 'react'
import { Link } from "react-router-dom";
import { useCookies } from 'react-cookie';

const Navbar = () => {

const [cookies, setCookies] = useCookies(["access_token"]);

  return (
    <div className='navbar'>

        <Link to="/"> Home </Link>
        <Link to="/createrecipe"> Create Recipe </Link>
        <Link to="/savedrecipes"> Saved Recipes </Link>
        {!cookies.access_token ? (<Link to="/auth"> Login/Register</Link>) : <button> Logout </button>}
    </div>
  )
}

// If there is no cookies.access_token it means that you are not logged in, so that means we show the <Link> for logging in, but if there is, it means you are already logged in and then we show a "Logout" Button.

export default Navbar