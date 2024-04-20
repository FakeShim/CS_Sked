import React, { useState, useEffect } from 'react';
import RequestsTable from './RequestsTable';
// import requestsData from './data.json'; // Import the JSON file
import './styles.css';

const Requests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // Fetch data from the backend when the component mounts
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch data from the backend API
      const response = await fetch('http://localhost:443/get-all-requests');
      if (response.ok) {
        const jsonData = await response.json();
        console.log(jsonData);
        setRequests(jsonData);
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // const handleDelete = (id) => {
  //   // Filter out the request with the specified id
  //   const updatedRequests = requests.filter(request => request._id.$oid !== id); // Adjust this condition based on your data structure
  //   // Update the state with the filtered requests
  //   setRequests(updatedRequests);
  //   // You can also send a request to your backend to delete the entry permanently
  // };

  const handleDelete = async (id) => {
    try {
      const response = await fetch('http://localhost:443/delete-requests', {
        method: 'PUT', // or 'POST' depending on your backend API
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(id)
      });

      if (!response.ok) {
        throw new Error('Failed to delete entry');
      }

      console.log('Entry deleted successfully');
      // Optionally, you can update the local state or perform any other actions after successful update
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  return (
    <div>  
      <div className="center-content">
        <h1>Requests</h1>
        <RequestsTable requests={requests} handleDelete={handleDelete} />
      </div>
    </div>
  );
};

export default Requests;
