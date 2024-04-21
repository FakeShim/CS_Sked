import React, { useEffect, useState, useRef } from 'react';

const timesByDay = {
  Monday: ["8:00-9:00", "9:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-1:00", "1:00-2:00", "2:00-3:00", "3:00-4:00", "4:00-5:00"],
  Tuesday: ["8:00-9:00", "9:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-1:00", "1:00-2:00", "2:00-3:00", "3:00-4:00", "4:00-5:00"],
  Wednesday: ["8:00-9:00", "9:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-1:00", "1:00-2:00", "2:00-3:00", "3:00-4:00", "4:00-5:00"],
  Thursday: ["8:00-9:00", "9:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-1:00", "1:00-2:00", "2:00-3:00", "3:00-4:00", "4:00-5:00"],
  Friday: ["8:00-9:00", "9:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-1:00", "1:00-2:00", "2:00-3:00", "3:00-4:00", "4:00-5:00"],
};

function TimeTable({ onTimesChange }) {
    //slectedTimes hold the state of which time slots are selected across all days
    const [selectedTimes, setSelectedTimes] = useState([]);
    const prevSelectedTimesRef = useRef({});

    //toggleTime function to toggle the selected state of a time slot
    //it add or remove the time slot from the selectedTimes state
    // Adjust the function to take both 'day' and 'time' as arguments.
    const toggleTime = (day, timeRange) => {
      setSelectedTimes(prev => ({
        ...prev,
        [day]: {
          ...(prev[day] || {}),
          [timeRange]: !(prev[day] && prev[day][timeRange])
        }
      }));
    };

    // useEffect is triggered when selectedTimes changes.
    // It calls onTimesChange to pass the selected times up to the parent component.
    useEffect(() => {
      const prevSelectedTimes = prevSelectedTimesRef.current;
      if (JSON.stringify(prevSelectedTimes) !== JSON.stringify(selectedTimes)) {
        const availability = Object.entries(selectedTimes).map(([day, times]) => ({
          day,
          times: Object.entries(times)
            .filter(([, available]) => available)
            .map(([timeRange]) => {
              const [Start, End] = timeRange.split("-");
              return { Start, End, available: true };
            })
        }));
        
        onTimesChange(availability);
        prevSelectedTimesRef.current = selectedTimes; // Update the ref to the new value
      }
    }, [selectedTimes, onTimesChange]); // onTimesChange can be omitted if it doesn't change or it's not dependent on the component render
  
    return (
        <div className="time-slots-container">
          {Object.entries(timesByDay).map(([day, times]) => (
          <div key={day} className="day-section">
            <h3>{day}</h3>
            {times.map(time => (
              <div key={time} className="time-slot">
                <label>
                  <input
                    type="checkbox"
                    // Check if the current timeIdentifier is included in the selectedTimes array
                    checked={selectedTimes.includes(`${day}-${time}`)}
                    // When the checkbox changes, call toggleTime with the day and time.
                    onChange={() => toggleTime(day, time)}
                  />
                  {time}
                </label>
              </div>
              ))}
            </div>
          ))}
        </div>
    );
  }
  export default TimeTable;