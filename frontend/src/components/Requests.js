// import React, { useState, useEffect } from 'react';
// import RequestsTable from './RequestsTable';
// import requestData from './data.json';
// import './styles.css';

// const Requests = () => {
//   const [requests, setRequests] = useState([]);

//   useEffect(() => {
//     // Set the requests data from the imported JSON file
//     setRequests(requestData);
//   }, []);

//   const handleStatusChange = (id) => {
//     setRequests(prevRequests => {
//       return prevRequests.map(request => {
//         if (request.id === id) {
//           return {
//             ...request,
//             status: request.status === 'Pending' ? 'Completed' : 'Pending'
//           };
//         }
//         return request;
//       });
//     });
//   };

//   return (
//     <div>  
//       <div className="center-content">
//         <h1>Requests</h1>
//         {/* Render the RequestsTable component with the fetched data */}
//         <RequestsTable requests={requests} handleStatusChange={handleStatusChange} />
//       </div>
//     </div>
//   );
// };

// export default Requests;


import React, { useState, useEffect } from 'react';
import RequestsTable from './RequestsTable';
import requestsData from './data.json'; // Import the JSON file
import './styles.css';

const Requests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // Set the requests data from the imported JSON file
    setRequests(requestsData);
  }, []);

  const handleDelete = (id) => {
    // Filter out the request with the specified id
    const updatedRequests = requests.filter(request => request._id.$oid !== id); // Adjust this condition based on your data structure
    // Update the state with the filtered requests
    setRequests(updatedRequests);
    // You can also send a request to your backend to delete the entry permanently
  };

  const handleStatusChange = (id) => {
    setRequests(prevRequests => {
      return prevRequests.map(request => {
        if (request._id.$oid === id) { // Adjust this condition based on your data structure
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
        <RequestsTable requests={requests} handleStatusChange={handleStatusChange} handleDelete={handleDelete} />
      </div>
    </div>
  );
};

export default Requests;
