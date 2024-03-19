import React from 'react';

// This function will transform the availability array into a string
// const formatAvailability = (availability) => {
//   return availability.map(avail => `${avail.day}: ${avail.times.map(time => `${time.Start} - ${time.End}`).join(', ')}`).join('; ');
// };

const AvailabilityTable = ({ users }) => {
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
        {users.map((user, index) => (
          <tr key={index}>
            <td>{user.firstName} {user.lastName}</td>
            <td>{user.email}</td>
            <td>
                <ul>
                    {user.availability.map((avail, idx) => (
                    <li key={idx}>
                        {`${avail.day}: `}
                        {avail.times.map((time, timeIdx) => (
                        <span key={timeIdx}>{`${time.Start} - ${time.End}${timeIdx < avail.times.length - 1 ? ', ' : ''}`}</span>
                        ))}
                    </li>
                    ))}
                </ul>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default AvailabilityTable;
