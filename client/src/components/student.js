import React, { useState, useCallback } from 'react';
import TimeTable from './TimeTable';

function StudentForm({ onSubmit }) {
  // Manage the state of the student object
  const [student, setStudent] = useState({
    name: '',
    email: '',
    hometown: '',
    times: []
  });

  // Handle the change of the input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent({ ...student, [name]: value });
  };

  // Memoize the handleTimesChange function so it doesn't cause unnecessary re-renders
  const handleTimesChange = useCallback((times) => {
    setStudent((prevStudent) => ({ ...prevStudent, times }));
  }, []);

  // Handles the submit of the form
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(student);
  };

  // Returns a form with the input fields and the TimeTable component
  return (
    <form onSubmit={handleSubmit}>
      <li>
        <label>
          Name: 
          <input type="text" name="name" value={student.name} onChange={handleChange} />
        </label>
      </li>
      <li>
        <label>
          Email: 
          <input type="email" name="email" value={student.email} onChange={handleChange} />
        </label>
      </li>
      <li>
        <label>
          Hometown:
          <input type="text" name="hometown" value={student.hometown} onChange={handleChange} />
        </label>
      </li>
      <li>
        <label>
          Available Times:
          <TimeTable onTimesChange={handleTimesChange} />
        </label>
      </li>
      <button type="submit">Submit</button>
    </form>
  );
}

export default StudentForm;
