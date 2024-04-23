import React, { useState } from 'react';
import axios from 'axios';

const backend_host = 'https://cs495-scheduler-3d74a13dd60d.herokuapp.com'

const AvailabilityTable = ({ users }) => {

  const handleSendEmail = async () => {
    const recip = 'dldillard@crimson.ua.edu'; // Replace with the recipient's email address
    const subject = 'From student req'; // Replace with the subject of the email
    const body = 'This is the body'; // Replace with the desired email body
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
    //check if any time slot is selected
    //submit button for email
    const isAnyTimeSelected = Object.values(checkedSlots).some((isChecked) => isChecked);
    
    if (!isAnyTimeSelected) {
      setMessage('Please select at least one time slot.');
    }
    else {
      handleSendEmail();
      setMessage('Request Sent');
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
