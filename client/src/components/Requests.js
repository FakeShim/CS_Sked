import React, { useState, useEffect } from 'react';
import RequestsTable from './RequestsTable';
// import requestsData from './data.json'; // Import the JSON file
import './styles.css';

const backend_host = 'https://cs495-scheduler-3d74a13dd60d.herokuapp.com'

const Requests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // Fetch data from the backend when the component mounts
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch data from the backend API
      const response = await fetch(`${backend_host}/get-all-requests`, {
        mode: 'no-cors'
      });
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


  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${backend_host}/delete-requests`, {
        method: 'PUT', // or 'POST' depending on your backend API
        headers: {
          'Content-Type': 'application/json'
        },
        mode: 'no-cors',
        body: JSON.stringify({ id }) // Make sure to send id as an object
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete entry');
      }
  
      console.log('Entry deleted successfully');
      
      // Find the index of the deleted entry in the requests array
      const index = requests.findIndex(request => request._id.$oid === id);
      if (index !== -1) {
        // If the entry exists, splice it from the array
        const updatedRequests = [...requests]; // Create a copy of the requests array
        updatedRequests.splice(index, 1); // Remove the element at the found index
        setRequests(updatedRequests); // Update the state with the modified array
      }
      
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
