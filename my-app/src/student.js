import React, { useState } from 'react';

function StudentForm({ onSubmit }) {
  const [student, setStudent] = useState({
    name: '',
    email: '',
    hometown: '',
    times: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent({ ...student, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(student);
  };

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
          Time:
          <input type="text" name="times" value={student.times} onChange={handleChange} />
        </label>
      </li>
    </form>
  );
}

export default StudentForm;
