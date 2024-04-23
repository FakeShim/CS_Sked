import React, { useState } from 'react';
import axios from 'axios';

const backend_host = 'https://cs495-scheduler-3d74a13dd60d.herokuapp.com'

const AvailabilityTable = ({ requests }) => {

  const handleSendEmail = async (recip) => {
    const subject = 'From student requests'; // Replace with the subject of the email
    const body = 'A request to meet with you has been sent. Please see the following link on the University domain to confirm: http://cs495-spring2024-11.ua.edu/Confirmation';
    try {
      await axios.get(`${backend_host}/send-email?recip=${encodeURIComponent(recip)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  // State to manage checked time slots.
  // It's an object where each key is a unique ID for a time slot, and its value is a boolean indicating whether it's checked.
  const [checkedSlots, setCheckedSlots] = useState({});
  const [message, setMessage] = useState(''); // State to manage the message to display to the user

  // Function to toggle the checked status of a time slot
  const toggleChecked = (slotId) => {
    setCheckedSlots((prevCheckedSlots) => ({
      ...prevCheckedSlots,
      [slotId]: !prevCheckedSlots[slotId], // Toggle the boolean value for the given slotId
    }));
  };

  const addEntry = async (new_entry) =>
  {
    try {
      const response = await fetch(`${backend_host}/add-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(new_entry)
      });

      if (!response.ok) {
        throw new Error('Failed to update entry');
      }

      console.log(`Entry ${JSON.stringify(updatedEntry)} updated successfully`);
      // Optionally, you can update the local state or perform any other actions after successful update
    } catch (error) {
      console.error('Error updating entry:', error);
    }
  }

  const handleSubmit = () => {
    if (Array.isArray(requests))
    {
      for (var idx = 0; idx < requests.length; idx++)
      {
        handleSendEmail(requests[idx].email);
        setMessage('Request sent to: ', requests[idx].email);

        var request = requests[idx];

        addEntry({"new_value": request});
      }
    }
    else
    {
      console.log("requests not initialized")
    }
  };

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
        {Array.isArray(requests) ? (
          requests.map((user, userIndex) => (
            <tr key={userIndex}>
              <td>{user.facultyFirst} {user.facultyLast}</td>
              <td>{user.email}</td>
            </tr>
          ))
        ) : (
          <tr>
          </tr>
        )}
        </tbody>
      </table>
      <div className="submit-container">
        <button onClick={handleSubmit}>Submit</button>
        {message && <div className="submit-message">{message}</div>}
      </div>             
    </>
  );
}

export default AvailabilityTable;
