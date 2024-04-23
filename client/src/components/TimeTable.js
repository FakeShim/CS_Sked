import React, { useState, useEffect } from 'react';

function getNextDays(startDate, numberOfWeeks = 1) {
  let currentDate = new Date(startDate);
  currentDate.setHours(0, 0, 0, 0); // Normalize the time to midnight
  // Start from the next day, skipping weekends
  do {
    currentDate.setDate(currentDate.getDate() + 1);
  } while (currentDate.getDay() === 0 || currentDate.getDay() === 6);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  let nextDays = [];

  for (let i = 0; i < daysOfWeek.length * numberOfWeeks; ) {
    const dayIndex = currentDate.getDay();
    if (dayIndex !== 0 && dayIndex !== 6) { // If it's not Sunday (0) or Saturday (6)
      const dayName = daysOfWeek[dayIndex - 1];
      nextDays.push({ dayName, date: new Date(currentDate) });
      i++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return nextDays;
}

// Define the time slots once
const timeSlots = [
  "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM",
  "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM",
  "4:00 PM", "5:00 PM"
];

function TimeTable({ onTimesChange }) {
  // The number of weeks you want to project into the future
  const numberOfWeeks = 2;
  // Get today's date to start from
  const startDate = new Date();

  // Generate the next occurrences of each day
  const nextDays = getNextDays(startDate, numberOfWeeks);

  const [availability, setAvailability] = useState({
  });

  const [selectedDate, setSelectedDate] = useState(null);

  const toggleDay = (dateString) => {
    setSelectedDate(selectedDate === dateString ? null : dateString);
  };

  const handleTimeChange = (day, times) => {
    setAvailability(prev => ({
      ...prev,
      [day]: times
    }));
  };

  // When the component's state updates, pass the new availability up to the parent component
  useEffect(() => {
    onTimesChange(availability);
  }, [availability, onTimesChange]);

  return (
    <div className="dates-container">
      {nextDays.map(({ dayName, date }, index) => {
        const dateString = date.toLocaleDateString();
        const dayIdentifier = `${dayName}-${dateString}`;
        const isSelected = selectedDate === dayIdentifier;
  
        return (
          <div key={dayIdentifier} className={`date-entry ${isSelected ? 'selected' : ''}`}>
            <button className="date-toggle" onClick={() => toggleDay(dayIdentifier)}>
              {dayName} - {dateString}
            </button>
            <div className="time-slots-container">
              {isSelected && timeSlots.map((time, timeIndex) => (
                <label key={timeIndex} className="time-slot">
                  <input
                    type="checkbox"
                    checked={availability[dayIdentifier]?.includes(time) || false}
                    onChange={(e) => {
                      const newTimes = e.target.checked
                        ? [...(availability[dayIdentifier] || []), time]
                        : availability[dayIdentifier].filter(t => t !== time);
                      handleTimeChange(dayIdentifier, newTimes);
                    }}
                  />
                  {time}
                </label>
              ))}
              </div>
            </div>
        );
      })}
    </div>
  );
}

export default TimeTable;