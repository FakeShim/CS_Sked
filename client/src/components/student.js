import React, { useState } from 'react';
import TimeTable from './TimeTable';

//Start of the form where it takes the onSubmit function
function StudentForm({ onSubmit }) { 
  //manage the state of the student object
  const [student, setStudent] = useState({
    name: '',
    email: '',
    hometown: '',
    times: []
  });

  //handles the change of the input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent({ ...student, [name]: value });
  };

  //handle the change of the times
  const handleTimesChange = (times) => {
    setStudent({ ...student, times });
  };

  //handles the submit of the form
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(student);
  };

  //returns a form with the input fields and the TimeTable component
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
          Time (8:00 AM - 5:00 PM CST):
          <TimeTable onTimesChange={handleTimesChange} />
        </label>
      </li>
      <button type="submit">Submit</button>
    </form>
  );
}

export default StudentForm;
