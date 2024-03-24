import React, { useState } from 'react';

const AvailabilityTable = ({ users }) => {
  // Create a state to store the checked values, initialized to all false
  const [checkedStates, setCheckedStates] = useState(
    users.map(user => 
      user.availability.map(avail => 
        avail.times.map(() => false)
      )
    )
  );

  const handleCheckboxChange = (userIndex, dayIndex, timeIndex) => {
    // Create a copy of the current state
    const newCheckedStates = [...checkedStates];
    // Toggle the checked state for the current checkbox
    newCheckedStates[userIndex][dayIndex][timeIndex] = !newCheckedStates[userIndex][dayIndex][timeIndex];
    // Update the state with the new value
    setCheckedStates(newCheckedStates);
  };

  return (
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
                    {user.availability.map((avail, dayIndex) => (
                    <li key={dayIndex}>
                        {`${avail.day}: `}
                        {avail.times.map((time, timeIndex) => (
                        <span key={timeIndex}>
                          {`${time.Start} - ${time.End}`}
                          <input
                            type="checkbox"
                            checked={checkedStates[userIndex][dayIndex][timeIndex]}
                            onChange={() => handleCheckboxChange(userIndex, dayIndex, timeIndex)}
                          />
                          {timeIndex < avail.times.length - 1 ? ', ' : ''}
                        </span>
                        ))}
                    </li>
                    ))}
                </ul>
            </td>
          </tr>
        ))}
      </tbody>
      <button type="submit">Submit</button>
    </table>
  );
}

export default AvailabilityTable;
