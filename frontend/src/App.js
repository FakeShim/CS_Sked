// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
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

// export default App;

import React, { useState, useEffect } from 'react';
import RequestsTable from './RequestsTable';
import './styles.css';

const requests = [
  { id: 1, name: 'Devin Booker', date: '2024-03-24', professor: 'Dr. Doe', status: 'Pending' },
  { id: 2, name: 'Jayson Tatum', date: '2024-03-25', professor: 'Dr. Ray', status: 'Approved' },
  { id: 3, name: 'Anthony Edwards', date: '2024-03-26', professor: 'Dr. Mi', status: 'Pending' },
  // Add more request objects as needed
];

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/data/');
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <header className="header">
        <div className='header-left'>
          <img src="ua_logo.png" alt="UA logo" />
          <h1 className='header-title'>Requests</h1>
        </div>
        <div className='nav-buttons'>
          <button className='nav-button'>Main</button>
          <button className='nav-button'>Faculty</button>
        </div>
      </header>  
      <h1>Requests</h1>
      <RequestsTable requests={requests} />
    </div>
  );
};

export default App;
