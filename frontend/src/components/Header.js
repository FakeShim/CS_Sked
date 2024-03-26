import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({loggedIn}) => {
  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="header-link">
          <img src="ua_logo.png" alt="Header Image" className="ua-logo" />
          <h1 className="header-title">Scheduler</h1>
        </Link>
      </div>
      {loggedIn ? (
      <div className="nav-buttons">
        <Link to="/Faculty" className="nav-button">Faculty</Link>
        <Link to="/Requests" className="nav-button">Requests</Link>
      </div>
      ) : (
        <div>
          
        </div>
      )}
    </header>
  );
}

export default Header;