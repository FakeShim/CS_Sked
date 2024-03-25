import React, { useState } from 'react';
import './styles.css';

const Faculty = () => {
  const [entries, setEntries] = useState([]);

  const handleChange = (index, field, value) => {
    const newEntries = [...entries];
    newEntries[index][field] = value;
    setEntries(newEntries);
  };

  const handleAddEntry = () => {
    setEntries([...entries, { name: '', email: '', schedule: {}, editable: true }]);
  };

  const handleEdit = (index) => {
    const newEntries = [...entries];
    newEntries[index].editable = true;
    setEntries(newEntries);
  };

  const handleToggleDay = (index, day) => {
    const newEntries = [...entries];
    if (!newEntries[index].schedule[day]) {
      newEntries[index].schedule[day] = [];
    } else {
      delete newEntries[index].schedule[day];
    }
    setEntries(newEntries);
  };

  const handleTimeChange = (index, day, time) => {
    const newEntries = [...entries];
    if (!newEntries[index].schedule[day]) {
      newEntries[index].schedule[day] = [];
    }
    const timeIndex = newEntries[index].schedule[day].indexOf(time);
    if (timeIndex === -1) {
      newEntries[index].schedule[day].push(time);
    } else {
      newEntries[index].schedule[day].splice(timeIndex, 1);
    }
    setEntries(newEntries);
  };

  const handleSubmit = (index) => {
    const { name, email, schedule } = entries[index];
    const newEntries = [...entries];
    let isValid = true;

    if (!name) {
      newEntries[index].nameError = "Name is required.";
      isValid = false;
    } else {
      newEntries[index].nameError = "";
    }

    if (!email || !validateEmail(email)) {
      newEntries[index].emailError = "Please enter a valid email address.";
      isValid = false;
    } else {
      newEntries[index].emailError = "";
    }

    if (Object.keys(schedule).length === 0) {
      newEntries[index].scheduleError = "At least one day must have a time selected.";
      isValid = false;
    } else {
      newEntries[index].scheduleError = "";
    }

    if (!isValid) {
      setEntries(newEntries);
      return;
    }

    newEntries[index].editable = false;
    setEntries(newEntries);
  };

  const handleRemoveEntry = (index) => {
    const newEntries = [...entries];
    newEntries.splice(index, 1);
    setEntries(newEntries);
  };

  // Function to validate email using regular expression
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const isDaySelected = (index, day) => {
    return entries[index].schedule[day] !== undefined;
  };

  const isTimeSelected = (index, day, time) => {
    return entries[index].schedule[day] && entries[index].schedule[day].includes(time);
  };

  return (
    <div className="Faculty">
      <div className="content">
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Schedule</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={index}>
                <td>
                  {entry.editable ? (
                    <div>
                      <input type="text" value={entry.name} onChange={(e) => handleChange(index, 'name', e.target.value)} required />
                      <div className="error">{entry.nameError}</div>
                    </div>
                  ) : (
                    entry.name
                  )}
                </td>
                <td>
                  {entry.editable ? (
                    <div>
                      <input type="email" value={entry.email} onChange={(e) => handleChange(index, 'email', e.target.value)} required />
                      <div className="error">{entry.emailError}</div>
                    </div>
                  ) : (
                    entry.email
                  )}
                </td>
                <td>
                  {entry.editable ? (
                      <div className="schedule-dropdowns">
                        <div className="schedule-buttons-container">
                          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                            <button
                              key={day}
                              className={`day-button ${isDaySelected(index, day) ? 'selected' : ''}`}
                              onClick={() => handleToggleDay(index, day)}
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                          isDaySelected(index, day) && (
                            <div key={day}>
                              <label htmlFor={`day-dropdown-${day}`}></label>
                              <select
                                id={`day-dropdown-${day}`}
                                multiple
                                value={entry.schedule[day]}
                                onChange={(e) => {
                                  const selectedTimes = Array.from(e.target.selectedOptions, option => option.value);
                                  handleChange(index, 'schedule', { ...entry.schedule, [day]: selectedTimes });
                                }}
                              >
                                {Array.from({ length: 12 }, (_, i) => i + 7).map(hour => (
                                  <option key={hour} value={hour}>{`${hour}:00`}</option>
                                ))}
                              </select>
                            </div>
                          )
                        ))}
                        <div className="error">{entry.scheduleError}</div>
                      </div>
                  ) : (
                    Object.entries(entry.schedule).map(([day, times]) => (
                      <div key={day}>
                        <strong>{day}:</strong> {times.map(time => `${time}:00`).join(', ')}
                      </div>
                    ))
                  )}
                </td>
                <td>
                  <div className="actions-button-container">
                    {entry.editable ? (
                        <>
                          <button onClick={() => handleSubmit(index)}>Submit</button>
                          <button onClick={() => handleRemoveEntry(index)}>Remove</button>
                        </>
                    ) : (
                        <button onClick={() => handleEdit(index)}>Edit</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={handleAddEntry}>Add Entry</button>
      </div>
    </div>
  );
}

export default Faculty;
