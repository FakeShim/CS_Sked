import { useEffect } from "react";
import React, {useState} from "react";

function TimeTable({ onTimesChange }) {
    const hours = ["8:00-9:00", "9:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-1:00", "1:00-2:00",
    "2:00-3:00", "3:00-4:00", "4:00-5:00"]; // Add more as needed
    const [selectedTimes, setSelectedTimes] = useState([]);
  
    const toggleTime = (time) => {
      if (selectedTimes.includes(time)) {
        setSelectedTimes(selectedTimes.filter(t => t !== time));
      } else {
        setSelectedTimes([...selectedTimes, time]);
      }
    };
  
    useEffect(() => {
      onTimesChange(selectedTimes);
    }, [selectedTimes, onTimesChange]);
  
    return (
        <div className="time-slots-container">
        {hours.map(hour => (
            <div key={hour} className="time-slot">
                <label>
                <input
                    type="checkbox"
                    checked={selectedTimes.includes(hour)}
                    onChange={() => toggleTime(hour)}
                    className="time-slot-checkbox"
                />
                <span className="time-slot-label">{hour}</span>
                </label>
            </div>
            ))}
        </div>
    );
  }
  export default TimeTable;