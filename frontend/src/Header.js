import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="header-link">
          <img src="ua_logo.png" alt="Header Image" className="ua-logo" />
          <h1 className="header-title">Scheduler</h1>
        </Link>
      </div>
      <div className="nav-buttons">
        <Link to="/faculty" className="nav-button">Faculty</Link>
        <Link to="/requests" className="nav-button">Requests</Link>
      </div>
    </header>
  );
}

export default Header;