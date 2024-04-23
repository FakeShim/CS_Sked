import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Home from '../Home';

describe('Home Component', () => {
  it('renders home component with student form and availability table', () => {
    // Mocking props
    const mockLoggedIn = true;
    const mockEmail = 'test@example.com';
    const mockSetLoggedIn = jest.fn();

    // Render the Home component
    const { getByText, getByLabelText } = render(
      <Home loggedIn={mockLoggedIn} email={mockEmail} setLoggedIn={mockSetLoggedIn} />
    );

    // Check if Logout button is rendered
    const logoutButton = getByText('Logout');
    expect(logoutButton).toBeInTheDocument();

    // Check if StudentForm component is rendered
    const studentForm = getByLabelText('Student Form');
    expect(studentForm).toBeInTheDocument();

    // Check if AvailabilityTable component is rendered
    const availabilityTable = getByLabelText('Availability Table');
    expect(availabilityTable).toBeInTheDocument();
  });

  it('logs out when Logout button is clicked', () => {
    // Mocking props
    const mockLoggedIn = true;
    const mockEmail = 'test@example.com';
    const mockSetLoggedIn = jest.fn();

    // Render the Home component
    const { getByText } = render(
      <Home loggedIn={mockLoggedIn} email={mockEmail} setLoggedIn={mockSetLoggedIn} />
    );

    // Find and click the Logout button
    const logoutButton = getByText('Logout');
    fireEvent.click(logoutButton);

    // Check if setLoggedIn function is called with false
    expect(mockSetLoggedIn).toHaveBeenCalledWith(false);
  });
});
