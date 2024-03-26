// src/components/Main.js

import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const Main = ({ loggedIn, email, setLoggedIn }) => {
  // Redirect to login page if not logged in
  
    const navigate = useNavigate();
    if (!loggedIn) {
      console.log('blocking access to main')
      return <Navigate to="/login " />;
    }
    
    const handleLogout = () => {
        if (loggedIn) {
          console.log('Before removal:User from localStorage:', localStorage.getItem("user"));
            localStorage.removeItem("user")
            console.log('After removal:User from localStorage:', localStorage.getItem("user"));
            setLoggedIn(false)
            navigate("/login")
        }
        else{
          navigate("/login")
        }
    }
 
 
  return (
    <div>
      <h2>Main Page</h2>
      <p>Welcome to the main page {email}!</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Main;
