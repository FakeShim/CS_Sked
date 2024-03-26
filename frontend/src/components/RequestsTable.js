import React from 'react';

const RequestsTable = ({ requests, handleStatusChange }) => {
  return (
    <table className="requests-table">
      <thead>
      <tr>
          <th style={{ width: '10%' }}>ID</th>
          <th style={{ width: '25%' }}>Name</th>
          <th style={{ width: '20%' }}>Date</th>
          <th style={{ width: '20%' }}>Professor</th>
          <th style={{ width: '15%' }}>Status</th>
          <th style={{ width: '10%' }}>Action</th> {/* New column for the action button */}
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
            <td> {/* New column for the action button */}
              <button onClick={() => handleStatusChange(request.id)}>
                {request.status === 'Pending' ? 'Complete' : 'Pending'}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RequestsTable;
