import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Login from '../Login';

describe('Login Component', () => {
  it('renders login form correctly', () => {
    const { getByLabelText, getByText } = render(<Login loggedIn={false} />);
    
    expect(getByLabelText('Email')).toBeInTheDocument();
    expect(getByLabelText('Password')).toBeInTheDocument();
    expect(getByText('Login')).toBeInTheDocument();
  });

  it('handles login with valid credentials', async () => {
    const { getByLabelText, getByText } = render(<Login loggedIn={false} />);
    
    fireEvent.change(getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'testpassword123' } });
    
    const submitButton = getByText('Login');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(localStorage.getItem('user')).toBeTruthy();
      // Add more assertions based on your application's behavior after successful login
    });
  });

  it('displays error message with invalid credentials', async () => {
    const { getByLabelText, getByText, findByText } = render(<Login loggedIn={false} />);
    
    fireEvent.change(getByLabelText('Email'), { target: { value: 'invalidemail' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'short' } });
    
    const submitButton = getByText('Login');
    fireEvent.click(submitButton);
    
    const errorElement = await findByText('Wrong Email or Password');
    expect(errorElement).toBeInTheDocument();
    expect(localStorage.getItem('user')).toBeNull(); // Ensure user is not logged in
  });

  it('handles logout when already logged in', () => {
    const setLoggedInMock = jest.fn();
    localStorage.setItem('user', JSON.stringify({ email: 'test@example.com', token: 'mockToken' }));
    
    const { getByText } = render(<Login loggedIn={true} setLoggedIn={setLoggedInMock} />);
    const logoutButton = getByText('Logout');
    
    fireEvent.click(logoutButton);
    
    expect(setLoggedInMock).toHaveBeenCalledWith(false);
    expect(localStorage.getItem('user')).toBeNull();
  });
});
