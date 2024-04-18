import { useEffect } from "react";
import React, {useState} from "react";

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

    //toggleTime function to toggle the selected state of a time slot
    //it add or remove the time slot from the selectedTimes state
    // Adjust the function to take both 'day' and 'time' as arguments.
    const toggleTime = (day, time) => {
      // Construct the unique identifier for the time slot.
      const timeIdentifier = `${day}-${time}`;
      
      // Check if the timeIdentifier is already included in the selectedTimes.
      if (selectedTimes.includes(timeIdentifier)) {
        // If so, filter it out to 'unselect' it.
        setSelectedTimes(selectedTimes.filter(t => t !== timeIdentifier));
      } else {
        // Otherwise, add the timeIdentifier to the selectedTimes array.
        setSelectedTimes([...selectedTimes, timeIdentifier]);
      }
    };

    // useEffect is triggered when selectedTimes changes.
    // It calls onTimesChange to pass the selected times up to the parent component.
    useEffect(() => {
      onTimesChange(selectedTimes);
    }, [selectedTimes, onTimesChange]);
  
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