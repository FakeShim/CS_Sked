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
  };
  const [users, setUsers] = useState([]);
  useEffect(() => {
  // use for later  
  //   fetch('/backend/find_person/')
  //     .then(response => response.json())
  //     .then(data => {
  //       console.log(data);
  //       setUsers(data);
  //     })
  //     .catch(error => console.error('Error:', error));
    // Here you would fetch the user data from MongoDB
    const mockUsersData = [
      {
        firstName: "Brandon",
        lastName: "Nguyen",
        email: "bhnguyen1@crimson.ua.edu",
        availability: [
          {
            day: "Monday",
            times: [
              { Start: "8:00", End: "9:00", available: true },
              { Start: "9:00", End: "10:00", available: true }
            ]
          },
          {
            day: "Tuesday",
            times: [
              { Start: "10:00", End: "11:00", available: true },
              { Start: "11:00", End: "12:00", available: true }
            ]
          }
          // ... other days
        ]
      },
      {
        firstName: "John",
        lastName: "Doe",
        email: "jdoe4@ua.edu",
        availability: [
          {
            day: "Monday",
            times: [
              { Start: "9:00", End: "10:00", available: true },
              { Start: "10:00", End: "11:00", available: true }
            ]
          },
          {
            day: "Wednesday",
            times: [
              { Start: "10:00", End: "11:00", available: true },
              { Start: "11:00", End: "12:00", available: true }
            ]
          }
          // ... other days
        ]
      }
      // ... other users
    ];
    
    setUsers(mockUsersData);
  }, []);


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