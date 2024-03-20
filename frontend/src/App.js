import React, { useState } from 'react';
import './styles.css';

function App() {
  const [entries, setEntries] = useState([{ name: '', email: '', location: '', editable: false }]);

  const handleChange = (index, field, value) => {
    const newEntries = [...entries];
    newEntries[index][field] = value;
    setEntries(newEntries);
  };

  const handleAddEntry = () => {
    setEntries([...entries, { name: '', email: '', location: '', editable: false }]);
  };

  const handleEdit = (index) => {
    const newEntries = [...entries];
    newEntries[index].editable = true;
    setEntries(newEntries);
  };

  const handleSubmit = (index) => {
    const newEntries = [...entries];
    newEntries[index].editable = false;
    setEntries(newEntries);
  };

  return (
    <div className="App">
      <header className="header">
        <div className="header-left">
            <img src="ua_logo.png" alt="Header Image" className="ua-logo" />
            <h1 className="header-title">Faculty</h1>
        </div>
        <div className="nav-buttons">
          <button className="nav-button">Main</button>
          <button className="nav-button">Requests</button>
        </div>
      </header>
      <div className="content">
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={index}>
                <td>
                  {entry.editable ? (
                    <input type="text" value={entry.name} onChange={(e) => handleChange(index, 'name', e.target.value)} />
                  ) : (
                    entry.name
                  )}
                </td>
                <td>
                  {entry.editable ? (
                    <input type="email" value={entry.email} onChange={(e) => handleChange(index, 'email', e.target.value)} />
                  ) : (
                    entry.email
                  )}
                </td>
                <td>
                  {entry.editable ? (
                    <input type="text" value={entry.location} onChange={(e) => handleChange(index, 'location', e.target.value)} />
                  ) : (
                    entry.location
                  )}
                </td>
                <td>
                  {entry.editable ? (
                    <button onClick={() => handleSubmit(index)}>Submit</button>
                  ) : (
                    <button onClick={() => handleEdit(index)}>Edit</button>
                  )}
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan="4">
                <button onClick={handleAddEntry}>Add Entry</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;