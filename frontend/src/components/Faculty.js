import React, { useState, useEffect } from 'react';
import './styles.css';

const Faculty = () => {
  const [entries, setEntries] = useState([]);
  const [data, setData] = useState({});


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

  const handleSubmit = (index) => {
    const { firstName, lastName, email, schedule } = entries[index];
    const newEntries = [...entries];
    let isValid = true;

    if (!firstName) {
      newEntries[index].firstError = "First name is required.";
      isValid = false;
    } else {
      newEntries[index].firstError = "";
    }

    if (!lastName) {
      newEntries[index].lastError = "Last name is required.";
      isValid = false;
    } else {
      newEntries[index].lastError = "";
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

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const isDaySelected = (index, day) => {
    return entries[index].schedule[day] !== undefined;
  };

  useEffect(() => {

    // Function to fetch data from JSON endpoint or use hardcoded JSON object
    const fetchData = async () => {
      // Hardcoded JSON object for demonstration
      // const jsonData = {
      //   "email": "bhngyen3@crimson.ua.edu",
      //   "availability": {
      //     "monday": [true, false, true, false, true, false, true, false, true, false, true, false],
      //     "tuesday": [true, false, true, false, true, false, true, false, true, false, true, false],
      //     "wednesday": [true, false, true, false, true, false, true, false, true, false, true, false],
      //     "thursday": [true, false, true, false, true, false, true, false, true, false, true, false],
      //     "friday": [true, false, true, false, true, false, true, false, true, false, true, false]
      //   },
      //   "facultyFirst": "Brandon",
      //   "facultyLast": "Nguyen"
      // };

      try {
        const response = await fetch('http://localhost:443/home');
        if (!response.ok)
        {
          throw new Error('Failed to fetch data');
        }

        const jsonData = await response.json();

        const bool_to_time = (schedule) => {
          var monday_array = [];
          var tuesday_array = [];
          var wednesday_array = [];
          var thursday_array = [];
          var friday_array = [];
          for (var idx = 0; idx < 12; idx++)
          {
            if(schedule.monday[idx])
            {
                monday_array.push(idx + 6);
            }
            if(schedule.tuesday[idx])
            {
                tuesday_array.push(idx + 6);
            }
            if(schedule.wednesday[idx])
            {
                wednesday_array.push(idx + 6);
            }
            if(schedule.thursday[idx])
            {
                thursday_array.push(idx + 6);
            }
            if(schedule.friday[idx])
            {
                friday_array.push(idx + 6);
            }
          }
          return {"Monday":monday_array, "Tuesday":tuesday_array, "Wednesday":wednesday_array, "Thursday":thursday_array, "Friday":friday_array};
        };

        const transformed_entries = {
            // Transform JSON data to match the format expected by entries state
            firstName: jsonData.facultyFirst,
            lastName: jsonData.facultyLast,
            email: jsonData.email,
            schedule: bool_to_time(jsonData.availability),
            editable: false // Set to false as it's not being edited initially
        };

        // Set the state with the transformed data
        setEntries([transformed_entries]);
      }
      catch (error)
      {
        console.error('Error fetching data:', error)
      }
    };
    // Call the fetchData function
    fetchData();
  }, []); // Empty dependency array to run the effect only once

  return (
    <div className="Faculty">
      <div className="content">
        <table className="user-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
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
                      <input type="text" value={entry.firstName} onChange={(e) => handleChange(index, 'firstName', e.target.value)} required />
                      <div className="error">{entry.firstError}</div>
                    </div>
                  ) : (
                    entry.firstName
                  )}
                </td>
                <td>
                  {entry.editable ? (
                    <div>
                      <input type="text" value={entry.lastName} onChange={(e) => handleChange(index, 'lastName', e.target.value)} required />
                      <div className="error">{entry.lastError}</div>
                    </div>
                  ) : (
                    entry.lastName
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
                        <div key={day} className="day-dropdown-container">
                          <button
                            className={`day-button ${isDaySelected(index, day) ? 'selected' : ''}`}
                            onClick={() => handleToggleDay(index, day)}
                          >
                            {day}
                          </button>
                          {isDaySelected(index, day) && (
                            <select
                              className="time-dropdown"
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
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="error">{entry.scheduleError}</div>
                  </div>
                ) : (
                  Object.entries(entry.schedule)
                    .sort(([dayA], [dayB]) => {
                      const order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
                      return order.indexOf(dayA) - order.indexOf(dayB);
                    })
                    .map(([day, times]) => (
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
