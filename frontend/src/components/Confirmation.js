// Confirmation.js
import React, { useState } from 'react';

const Confirmation = () => {
  // State variables for storing search results and updated results
  const [searchResults, setSearchResults] = useState([]);
  const [updatedResults, setUpdatedResults] = useState([]);
  const [selectedDateTime, setSelectedDateTime] = useState({ date: '', time: '' });

  // Function to fetch search results from the backend
  const fetchSearchResults = async (query) => {
    try {
      const response = await fetch(`/get-request-by-email?email=${query}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSearchResults(data);
      setUpdatedResults(data);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  // Function to handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get('email');
    fetchSearchResults(query);
  };

  // Function to handle confirmation of a request
  // Function to handle confirmation of a request
const handleConfirmRequest = async (id) => {
  try {
    // Construct the payload for updating the backend entry
    const payload = {
      status: 'Accepted',
      req: {
        [selectedDateTime.date]: [{ $numberInt: selectedDateTime.time }]
      }
    };
    query = {"_id":id}
    update = {"query":query, "new_value":payload};

    // Send a PUT request to confirm the request with the backend and update the entry
    const response = await fetch(`/api/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(update),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    // Update the status locally if needed
    const updated = updatedResults.map(result => {
      if (result._id.$oid === id) {
        return { ...result, date: selectedDateTime.date, req: { [selectedDateTime.date]: [{ $numberInt: selectedDateTime.time }] }, status: 'Accepted' };
      }
      return result;
    });
    setUpdatedResults(updated);
  } catch (error) {
    console.error('Error confirming request:', error);
  }
};

  // Function to handle changing the selected date
  const handleDateChange = (e) => {
    setSelectedDateTime({ ...selectedDateTime, date: e.target.value, time: '' });
  };

  // Function to handle changing the selected time
  const handleTimeChange = (e) => {
    setSelectedDateTime({ ...selectedDateTime, time: e.target.value });
  };

  // Component rendering
  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          name="email"
          placeholder="Search by email"
        />
        <button type="submit">Search</button>
      </form>
      <div>
        <h2>Search Results</h2>
        <table>
          <thead>
            <tr>
              <th style={{ width: '20%' }}>Email</th>
              <th style={{ width: '20%' }}>Student</th>
              <th style={{ width: '20%' }}>Date</th>
              <th style={{ width: '10%' }}>Times</th>
              <th style={{ width: '20%' }}>Status</th>
              <th style={{ width: '10%' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.map((result) => (
              <tr key={result._id.$oid}>
                <td>{result.email}</td>
                <td>{`${result.studentFirst} ${result.studentLast}`}</td>
                <td>
                  <select onChange={handleDateChange} value={selectedDateTime.date}>
                    <option value="">Select Date</option>
                    {Object.keys(result.req).map(date => (
                      <option key={date} value={date}>{date}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <select onChange={handleTimeChange} value={selectedDateTime.time}>
                    <option value="">Select Time</option>
                    {selectedDateTime.date && result.req[selectedDateTime.date].map((time, index) => (
                      <option key={index} value={time}>{time}</option>
                    ))}
                  </select>
                </td>
                <td>{result.status}</td>
                <td>
                  <button onClick={() => handleConfirmRequest(result._id.$oid)}>Confirm</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Confirmation;
