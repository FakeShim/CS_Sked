import React, { useState } from 'react';
import axios from 'axios';

const backend_host = 'https://cs495-scheduler-3d74a13dd60d.herokuapp.com'

const AvailabilityTable = ({ users }) => {

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

  const handleSubmit = () => {
    if (Array.isArray(users))
    {
      for (idx = 0; idx < users.length; idx++)
      {
        handleSendEmail(users[idx].email);
        setMessage('Request sent to: ', users[idx].email);
      }
    }
    else
    {
      console.log("users not initialized")
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
        {Array.isArray(users) ? (
          users.map((user, userIndex) => (
            <tr key={userIndex}>
              <td>{user.firstName} {user.lastName}</td>
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
