import React, { useState, useEffect } from 'react';
import './styles.css';

const backend_host = 'https://cs495-scheduler-3d74a13dd60d.herokuapp.com'

const Faculty = () => {
  const [entries, setEntries] = useState([]);

  const handleChange = (index, field, value) => {
    const newEntries = [...entries];
    newEntries[index][field] = value;
    setEntries(newEntries);
  };

  const handleAddEntry = () => {
    const response = addEntry();

    response.then(function(new_id)
    {
      setEntries([...entries, { _id: new_id, name: '', email: '', availability: {}, editable: true }]);
    });

  };

  const handleEdit = (index) => {
    const newEntries = [...entries];
    newEntries[index].editable = true;
    setEntries(newEntries);
  };

  const handleToggleDay = (index, day) => {
    const newEntries = [...entries];
    if (!newEntries[index].availability[day]) {
      newEntries[index].availability[day] = [];
    } else {
      delete newEntries[index].availability[day];
    }
    setEntries(newEntries);
  };

  const handleSubmit = (index) => {
    const { _id, facultyFirst, facultyLast, email, availability } = entries[index];
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

    if (Object.keys(availability).length === 0) {
      newEntries[index].scheduleError = "At least one day must have a time selected.";
      isValid = false;
    } else {
      newEntries[index].scheduleError = "";
    }

    if (!isValid) {
      setEntries(newEntries);
      return;
    }

    const query = {"_id":_id};
    console.log(entries[index]);

    const new_value = {'facultyFirst':facultyFirst, 'facultyLast':facultyLast, 'email':email, 'availability': availability};

    updateEntry({"query":query, "new_value":new_value});

    newEntries[index].editable = false;
    setEntries(newEntries);
  };

  const handleRemoveEntry = (index) => {
    const newEntries = [...entries];

    const query = {"_id":newEntries[index]._id};

    newEntries.splice(index, 1);

    deleteEntry(query);

    setEntries(newEntries);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const isDaySelected = (index, day) => {
    return entries[index].availability[day] !== undefined;
  };

  const addEntry = async () => {
    try {
      const response = await fetch(`${backend_host}/add-blank-faculty`, {
        mode: no-cors
      });

      if (!response.ok) {
        throw new Error('Failed to add entry');
      }

      const responseJson = await response.json();

      console.log('Entry added successfully. response = ', responseJson);
      return responseJson;

    } catch (error) {
      console.error('Error adding entry:', error);
    }
  };

  const updateEntry = async (updatedEntry) => {
    try {
      const response = await fetch(`${backend_host}/update-faculty`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        mode: no-cors,
        body: JSON.stringify(updatedEntry)
      });

      if (!response.ok) {
        throw new Error('Failed to update entry');
      }



      console.log(`Entry ${JSON.stringify(updatedEntry)} updated successfully`);
      // Optionally, you can update the local state or perform any other actions after successful update
    } catch (error) {
      console.error('Error updating entry:', error);
    }
  };

  const deleteEntry = async (deletedEntry) => {
    console.log('deletedEntry: ', deletedEntry)
    try {
      const response = await fetch(`${backend_host}/delete-faculty`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        mode: no-cors,
        body: JSON.stringify(deletedEntry)
      });

      if (!response.ok)
      {
        throw new Error('Failed to delete entry');
      }

      console.log(`Entry ${JSON.stringify(deletedEntry)} deleted successfully`);
    }
    catch (error)
    {
      console.error('Error deleting entry:', error);
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
        const response = await fetch(`${backend_host}/get-all-faculty`, {
          mode: no-cors
        });
        if (!response.ok)
        {
          throw new Error('Failed to fetch data');
        }

        const jsonData = await response.json();

        console.log(jsonData);

        const bool_to_time = (availability) => {
          var monday_array = [];
          var tuesday_array = [];
          var wednesday_array = [];
          var thursday_array = [];
          var friday_array = [];
          for (var idx = 0; idx < 12; idx++)
          {
            if(availability.Monday[idx])
            {
                monday_array.push(idx + 6);
            }
            if(availability.Tuesday[idx])
            {
                tuesday_array.push(idx + 6);
            }
            if(availability.Wednesday[idx])
            {
                wednesday_array.push(idx + 6);
            }
            if(availability.Thursday[idx])
            {
                thursday_array.push(idx + 6);
            }
            if(availability.Friday[idx])
            {
                friday_array.push(idx + 6);
            }
          }
          return {"Monday":monday_array, "Tuesday":tuesday_array, "Wednesday":wednesday_array, "Thursday":thursday_array, "Friday":friday_array};
        };

        const transformed_entries = jsonData.map(entry => ({
          _id:entry._id,
          facultyFirst: entry.facultyFirst,
          facultyLast: entry.facultyLast,
          email: entry.email,
          availability: bool_to_time(entry.availability),
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
                  <div className="availability-dropdowns">
                    <div className="availability-buttons-container">
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
                              value={entry.availability[day]}
                              onChange={(e) => {
                                const selectedTimes = Array.from(e.target.selectedOptions, option => option.value);
                                handleChange(index, 'availability', { ...entry.availability, [day]: selectedTimes });
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
                  Object.entries(entry.availability)
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
