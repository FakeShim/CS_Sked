import React, { useState, useEffect } from 'react';
import './styles.css';

// Hardcoded JSON object for demonstration
const jsonTestData = {
  "email": "bhngyen3@crimson.ua.edu",
  "availability": {
    "monday": [true, false, true, false, true, false, true, false, true, false, true, false],
    "tuesday": [true, false, true, false, true, false, true, false, true, false, true, false],
    "wednesday": [true, false, true, false, true, false, true, false, true, false, true, false],
    "thursday": [true, false, true, false, true, false, true, false, true, false, true, false],
    "friday": [true, false, true, false, true, false, true, false, true, false, true, false]
  },
  "facultyFirst": "Brandon",
  "facultyLast": "Nguyen"
};

const Faculty = () => {
  const [entries, setEntries] = useState([]);
  const [data, setData] = useState({});


  const handleChange = (index, field, value) => {
    const newEntries = [...entries];

    const query = {"facultyFirst":newEntries[index].facultyFirst, "facultyLast":newEntries[index].facultyLast};
    const new_value = {[field]:value};

    console.log(field);

    newEntries[index][field] = value;

    updateEntry({"query":query, "new_value":new_value});

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
    const { facultyFirst, facultyLast, email, schedule } = entries[index];
    const newEntries = [...entries];
    let isValid = true;

    if (!facultyFirst) {
      newEntries[index].firstError = "First name is required.";
      isValid = false;
    } else {
      newEntries[index].firstError = "";
    }

    if (!facultyLast) {
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

  const updateEntry = async (updatedEntry) => {
    try {
      const response = await fetch('http://localhost:443/update-faculty', {
        method: 'PUT', // or 'POST' depending on your backend API
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedEntry)
      });

      if (!response.ok) {
        throw new Error('Failed to update entry');
      }

      console.log('Entry updated successfully');
      // Optionally, you can update the local state or perform any other actions after successful update
    } catch (error) {
      console.error('Error updating entry:', error);
    }
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
        const response = await fetch('http://localhost:443/get-all-faculty');
        if (!response.ok)
        {
          throw new Error('Failed to fetch data');
        }

        const jsonData = await response.json();

        console.log(jsonData);

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

        const transformed_entries = jsonData.map(entry => ({
          facultyFirst: entry.facultyFirst,
          facultyLast: entry.facultyLast,
          email: entry.email,
          schedule: bool_to_time(entry.availability),
          editable: false
        }));

        // Set the state with the transformed data
        setEntries(transformed_entries);
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
                      <input type="text" value={entry.facultyFirst} onChange={(e) => handleChange(index, 'facultyFirst', e.target.value)} required />
                      <div className="error">{entry.firstError}</div>
                    </div>
                  ) : (
                    entry.facultyFirst
                  )}
                </td>
                <td>
                  {entry.editable ? (
                    <div>
                      <input type="text" value={entry.facultyLast} onChange={(e) => handleChange(index, 'facultyLast', e.target.value)} required />
                      <div className="error">{entry.lastError}</div>
                    </div>
                  ) : (
                    entry.facultyLast
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
