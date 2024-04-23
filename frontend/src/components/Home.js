import StudentForm from './student';
import AvailabilityTable from './table';
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const Home = ({ loggedIn, email, setLoggedIn }) => {

  const navigate = useNavigate();
  if (!loggedIn) {
    console.log('blocking access to home')
    return <Navigate to="/login " />;
  }

  const handleFormSubmit = (studentData) => {
    // Implement the function to submit the form data to your backend
    console.log(studentData);
    
    // Make an API call to the backend to save the data
    //fetch the data to the backend server
    fetch('http://localhost:3001/faculty-availability', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        setUsers(data);
      })
      .catch((error) => {
        console.error('Error:', error);
    })
  };

  const [users, setUsers] = useState([]);

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
    <>
    <div className="home-container">
      <div className="student-form">
      <button onClick={handleLogout}>Logout</button>
        <StudentForm onSubmit={handleFormSubmit} />
      </div>
      <div className="student-table">
        <AvailabilityTable users={users} />
      </div>
    </div>
    </>
  );
}

export default Home;