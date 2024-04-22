// import React, { useState, useEffect } from 'react';
// import './styles.css';

// const ConfirmationPage = () => {
//   const [email, setEmail] = useState('');
//   const [time, setTime] = useState('');
//   const [comments, setComments] = useState('');
//   const [accepted, setAccepted] = useState(false);

//   const handleAccept = () => {
//     // Handle accept logic, for example, send confirmation to the server
//     setAccepted(true);
//   };

//   const handleDeny = () => {
//     // Handle deny logic, for example, cancel the meeting
//     // This can also include some redirect logic
//   };

//   return (
//     <div>
//       <h2>Confirmation Page</h2>
//       <form>
//         <div>
//           <label>Email Address:</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//         </div>
//         <div>
//           <label>Time of Meeting:</label>
//           <input
//             type="text"
//             value={time}
//             onChange={(e) => setTime(e.target.value)}
//           />
//         </div>
//         <div>
//           <label>Extra Comments:</label>
//           <textarea
//             value={comments}
//             onChange={(e) => setComments(e.target.value)}
//           />
//         </div>
//         <button type="button" onClick={handleAccept}>Accept</button>
//         <button type="button" onClick={handleDeny}>Deny</button>
//       </form>
//       {accepted && <p>Meeting accepted!</p>}
//     </div>
//   );
// }

// export default ConfirmationPage;
import React, { useState, useEffect } from 'react';
// import RequestsTable from './RequestsTable';
import './styles.css';
// import React, { useState } from 'react';

function ConfirmationPage() {
  const [email, setEmail] = useState('');
  const [time, setTime] = useState('');
  const [comments, setComments] = useState('');
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    // Handle accept logic, for example, send confirmation to the server
    setAccepted(true);
  };

  const handleDeny = () => {
    // Handle deny logic, for example, cancel the meeting
    // This can also include some redirect logic
  };

  return (
      <div>
       <header className="header">
         <div className='header-left'>
          <img src="ua_logo.png" alt="Header Image" className="ua-logo" />
          <h1 className="header-title">Confirmation Page</h1>
         </div>
       </header>
      <form>
        <div>
          <label>Email Address:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Time of Meeting:</label>
          <input
            type="text"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <div>
          <label>Extra Comments:</label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>
        <button type="button" onClick={handleAccept}>Accept</button>
        <button type="button" onClick={handleDeny}>Deny</button>
      </form>
      {accepted && <p>Meeting accepted!</p>}
    </div>
  );
}

export default ConfirmationPage;
