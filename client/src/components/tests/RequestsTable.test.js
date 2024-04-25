import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import RequestsTable from './RequestsTable';

describe('RequestsTable component', () => {
  const requests = [
    {
      _id: '1',
      email: 'test1@example.com',
      times: { '2024-04-23': ['10:00 AM'] },
      facultyFirst: 'John',
      facultyLast: 'Doe',
      studentFirst: 'Jane',
      studentLast: 'Doe',
      status: 'Pending',
    },
    {
      _id: '2',
      email: 'test2@example.com',
      times: { '2024-04-24': ['11:00 AM'] },
      facultyFirst: 'Alice',
      facultyLast: 'Smith',
      studentFirst: 'Bob',
      studentLast: 'Smith',
      status: 'Accepted',
    },
  ];

  const handleDelete = jest.fn();

  it('renders table with correct data', () => {
    const { getByText } = render(<RequestsTable requests={requests} handleDelete={handleDelete} />);
    
    // Assert table headers
    expect(getByText('Delete')).toBeInTheDocument();
    expect(getByText('Email')).toBeInTheDocument();
    expect(getByText('Date')).toBeInTheDocument();
    expect(getByText('Faculty')).toBeInTheDocument();
    expect(getByText('Student')).toBeInTheDocument();
    expect(getByText('Status')).toBeInTheDocument();
    
    // Assert table content
    requests.forEach(request => {
      expect(getByText(request.email)).toBeInTheDocument();
      expect(getByText(`${request.facultyFirst} ${request.facultyLast}`)).toBeInTheDocument();
      expect(getByText(`${request.studentFirst} ${request.studentLast}`)).toBeInTheDocument();
      expect(getByText(request.status)).toBeInTheDocument();
      if (request.status === 'Pending') {
        expect(getByText(Object.keys(request.times)[0])).toBeInTheDocument();
      } else {
        expect(getByText(Object.keys(request.times)[0])).toHaveTextContent(request.times[Object.keys(request.times)[0]][0]);
      }
    });
  });

  it('calls handleDelete function when delete button is clicked', () => {
    const { getByText } = render(<RequestsTable requests={requests} handleDelete={handleDelete} />);
    
    // Click delete button for each request
    requests.forEach(request => {
      fireEvent.click(getByText('Delete'));
      expect(handleDelete).toHaveBeenCalledWith(request._id);
    });
    
    // Ensure handleDelete is called the correct number of times
    expect(handleDelete).toHaveBeenCalledTimes(requests.length);
  });
});
