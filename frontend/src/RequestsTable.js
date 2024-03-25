import React from 'react';

const RequestsTable = ({ requests }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Date</th>
          <th>Professor</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {requests.map(request => (
          <tr key={request.id}>
            <td>{request.id}</td>
            <td>{request.name}</td>
            <td>{request.date}</td>
            <td>{request.professor}</td>
            <td>{request.status}</td>
            {/* <td>
              <button onClick={() => handleAction(request.id)}>Action</button>
            </td> */}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RequestsTable;
