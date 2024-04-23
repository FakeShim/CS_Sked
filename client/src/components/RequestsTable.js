// import React from 'react';

// const RequestsTable = ({ requests, handleDelete }) => {
//   return (
//     <table className="requests-table">
//       <thead>
//         <tr>
//           <th style={{ width: '10%' }}>Delete</th> {/* New column for delete buttons */}
//           <th style={{ width: '20%' }}>Email</th>
//           <th style={{ width: '15%' }}>Date</th>
//           <th style={{ width: '20%' }}>Faculty</th>
//           <th style={{ width: '20%' }}>Student</th>
//           <th style={{ width: '15%' }}>Status</th>
//         </tr>
//       </thead>
//       <tbody>
//         {requests.map(request => (
//           <tr key={request._id.$oid}>
//             {/* Delete button in the new column */}
//             <td>
//               <button onClick={() => handleDelete(request._id.$oid)}>Delete</button>
//             </td>
//             {/* Rest of the table data */}
//             <td>{request.email}</td>
//             <td>{Object.keys(request.times).join(', ')}</td>
//             <td>{`${request.facultyFirst} ${request.facultyLast}`}</td>
//             <td>{`${request.studentFirst} ${request.studentLast}`}</td>
//             <td>{request.status}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };

// export default RequestsTable;


import React from 'react';

const RequestsTable = ({ requests, handleDelete }) => {
  return (
    <table className="requests-table">
      <thead>
        <tr>
          <th style={{ width: '10%' }}>Delete</th> {/* New column for delete buttons */}
          <th style={{ width: '20%' }}>Email</th>
          <th style={{ width: '15%' }}>Date</th>
          <th style={{ width: '20%' }}>Faculty</th>
          <th style={{ width: '20%' }}>Student</th>
          <th style={{ width: '15%' }}>Status</th>
        </tr>
      </thead>
      <tbody>
        {requests.map(request => (
          <tr key={request._id}>
            {/* Delete button in the new column */}
            <td>
              <button onClick={() => handleDelete(request._id)}>Delete</button>
            </td>
            {/* Rest of the table data */}
            <td>{request.email}</td>
            <td>
              {request.status === "Accepted" ? (
                <>
                  <strong>{Object.keys(request.times)[0]}</strong>: {request.times[Object.keys(request.times)[0]][0]}
                </>
              ) : (
                Object.keys(request.times)[0]
              )}
            </td>
            <td>{`${request.facultyFirst} ${request.facultyLast}`}</td>
            <td>{`${request.studentFirst} ${request.studentLast}`}</td>
            <td>{request.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RequestsTable;

