// import logo from './logo.svg';
import './App.css';
import Navbar from './navbar';
import StudentForm from './student';
import AvailabilityTable from './table';
import React, { useEffect, useState } from 'react';
// import StudentTable from './table';

function App() {
  const handleFormSubmit = (studentData) => {
    // Implement the function to submit the form data to your backend
    console.log(studentData);
    // Make an API call to the backend to save the data
  };
  const [users, setUsers] = useState([]);
  useEffect(() => {
    // Here you would fetch the user data from MongoDB
    // For example purposes, I'm using mock data based on the image you uploaded
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

  return (
    <>
    <Navbar />
    <div className="app-container">
      <div className="student-form">
        <StudentForm onSubmit={handleFormSubmit} />
      </div>
      <div className="student-table">
        <AvailabilityTable users={users} />
      </div>
    </div>
    </>
  );
}

export default App;
