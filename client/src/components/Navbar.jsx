import React from 'react';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [cookies, setCookies] = useCookies(['access_token']);
  const navigate = useNavigate();

  const logout = () => {
    setCookies('access_token', '');
    window.localStorage.removeItem('userID');
    navigate('/auth');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container justify-content-center">
        <Link to="/" className="navbar-brand" style={{ fontSize: '27px' }}>Home</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item border-0 mt-1"> 
              <Link to="/createrecipe" className="nav-link p-3" style={{ fontSize: '24px' }}>Create Recipe</Link> 
            </li>
            {!cookies.access_token ? (
              <li className="nav-item border-0 mt-1"> 
                <Link to="/auth" className="nav-link p-3" style={{ fontSize: '24px' }}>Login/Register</Link> 
              </li>
            ) : (
              <>
                <li className="nav-item border-0 mt-1"> 
                  <Link to="/savedrecipes" className="nav-link p-3" style={{ fontSize: '24px' }}>Saved Recipes</Link> 
                </li>
                <li className="nav-item border-0 mt-4">
                  <button onClick={logout} className="btn btn-link text-white" style={{ fontSize: '20px' }}>Logout</button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
