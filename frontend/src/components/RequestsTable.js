// // import React from 'react';

// // const RequestsTable = ({ requests, handleStatusChange }) => {
// //   return (
// //     <table className="requests-table">
// //       <thead>
// //       <tr>
// //           <th style={{ width: '10%' }}>ID</th>
// //           <th style={{ width: '25%' }}>Name</th>
// //           <th style={{ width: '20%' }}>Date</th>
// //           <th style={{ width: '20%' }}>Professor</th>
// //           <th style={{ width: '15%' }}>Status</th>
// //           <th style={{ width: '10%' }}>Action</th> {/* New column for the action button */}
// //         </tr>
// //       </thead>
// //       <tbody>
// //         {requests.map(request => (
// //           <tr key={request.id}>
// //             <td>{request.id}</td>
// //             <td>{request.name}</td>
// //             <td>{request.date}</td>
// //             <td>{request.professor}</td>
// //             <td>{request.status}</td>
// //             <td> {/* New column for the action button */}
// //               <button onClick={() => handleStatusChange(request.id)}>
// //                 {request.status === 'Pending' ? 'Complete' : 'Pending'}
// //               </button>
// //             </td>
// //           </tr>
// //         ))}
// //       </tbody>
// //     </table>
// //   );
// // };

// // export default RequestsTable;

// import React from 'react';

// const RequestsTable = ({ requests, handleStatusChange }) => {
//   return (
//     <table className="requests-table">
//       <thead>
//         <tr>
//           <th style={{ width: '10%' }}>ID</th>
//           <th style={{ width: '20%' }}>Date</th>
//           <th style={{ width: '20%' }}>Faculty</th>
//           <th style={{ width: '20%' }}>Student</th>
//           <th style={{ width: '20%' }}>Status</th>
//           <th style={{ width: '10%' }}>Action</th>
//         </tr>
//       </thead>
//       <tbody>
//         {requests.map(request => (
//           <tr key={request._id.$oid}>
//             <td>{request._id.$oid}</td>
//             <td>{request.date}</td>
//             <td>{`${request.facultyFirst} ${request.facultyLast}`}</td>
//             <td>{`${request.studentFirst} ${request.studentLast}`}</td>
//             <td>{request.status}</td>
//             <td>
//               <button onClick={() => handleStatusChange(request._id.$oid)}>
//                 {request.status === 'Pending' ? 'Complete' : 'Pending'}
//               </button>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };

// export default RequestsTable;

import React from 'react';

const RequestsTable = ({ requests, handleStatusChange, handleDelete }) => {
  return (
    <table className="requests-table">
      <thead>
        <tr>
          <th style={{ width: '5%' }}>Delete</th> {/* New column for delete buttons */}
          {/* <th style={{ width: '10%' }}>ID</th> */}
          <th style={{ width: '25%' }}>Date</th>
          <th style={{ width: '25%' }}>Faculty</th>
          <th style={{ width: '25%' }}>Student</th>
          <th style={{ width: '20%' }}>Status</th>
        </tr>
      </thead>
      <tbody>
        {requests.map(request => (
          <tr key={request._id.$oid}>
            {/* Delete button in the new column */}
            <td>
              <button onClick={() => handleDelete(request._id.$oid)}>Delete</button>
            </td>
            {/* Rest of the table data */}
            {/* <td>{request._id.$oid}</td> */}
            <td>{request.date}</td>
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
