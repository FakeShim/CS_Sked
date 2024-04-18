import React, { useState } from 'react';
import axios from 'axios';

const AvailabilityTable = ({ users }) => {

  const handleSendEmail = async () => {
    const recip = 'jcburns6@crimson.ua.edu'; // Replace with the recipient's email address
    const subject = 'From student req'; // Replace with the subject of the email
    const body = 'This is the body'; // Replace with the desired email body
    try {
      await axios.get(`http://localhost:3080/send-email?recip=${encodeURIComponent(recip)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
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
            <th>Availability</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, userIndex) => (
            <tr key={userIndex}>
              <td>{user.firstName} {user.lastName}</td>
              <td>{user.email}</td>
              <td>
                  <ul>
                      {user.availability.map((avail, availIndex) => (
                      <li key={availIndex}>
                          {`${avail.day}: `}
                          {avail.times.map((time, timeIndex) => {
                            // Construct a unique ID for each time slot
                            const slotId = `${user.email}-${avail.day}-${timeIndex}`;
                            return (
                              <div key={timeIndex} style={{ display: 'inline-block', marginRight: '10px' }}>
                                {`${time.Start} - ${time.End}`}
                                <input
                                  type="checkbox"
                                  style={{ marginLeft: '5px' }}
                                  checked={!!checkedSlots[slotId]}
                                  onChange={() => toggleChecked(slotId)}
                                />
                                {timeIndex < avail.times.length - 1 ? ', ' : ''}
                              </div>
                            );
                          })} 
                      </li>
                      ))}
                  </ul>
              </td>
            </tr>
          ))}
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
