// import logo from './logo.svg';
// import './Requests.css';

// function Requests() {
//   return (
//     <div className="Requests">
//       <header className="Requests-header">
//         <img src={logo} className="Requests-logo" alt="logo" />
//         <p>
//           Edit <code>src/Requests.js</code> and save to reload.
//         </p>
//         <a
//           className="Requests-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default Requests;

import React, { useState, useEffect } from 'react';
import RequestsTable from './RequestsTable';
import './styles.css';

const Requests = () => {
  const [requests, setRequests] = useState([
    { id: 1, name: 'Devin Booker', date: '2024-03-24', professor: 'Dr. Doe', status: 'Pending' },
    { id: 2, name: 'Jayson Tatum', date: '2024-03-25', professor: 'Dr. Ray', status: 'Completed' },
    { id: 3, name: 'Anthony Edwards', date: '2024-03-26', professor: 'Dr. Mi', status: 'Pending' },
    // Add more request objects as needed
  ]);

  const handleStatusChange = (id) => {
    setRequests(prevRequests => {
      return prevRequests.map(request => {
        if (request.id === id) {
          return {
            ...request,
            status: request.status === 'Pending' ? 'Completed' : 'Pending'
          };
        }
        return request;
      });
    });
  };

  return (
    <div>  
      <div className="center-content">
        <h1>Requests</h1>
        <RequestsTable requests={requests} handleStatusChange={handleStatusChange} />
      </div>
    </div>
  );
};

export default Requests;
