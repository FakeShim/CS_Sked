import React, { useState, useEffect } from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Requests from '../Requests'; // Assuming Requests.js is in the same directory as Requests.test.js

// Custom mock implementation for useState
const mockUseState = (initialValue) => {
  let state = initialValue;
  const setState = (newValue) => {
    state = newValue;
  };
  return [state, setState];
};

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
  useEffect: jest.fn(),
}));

describe('Requests Component', () => {
  beforeEach(() => {
    // Reset the mock implementation of useState and useEffect before each test
    jest.clearAllMocks();
  });

  it('handles delete request', async () => {
    // Mock useState and useEffect hooks using the custom mock implementation
    useState.mockImplementation(mockUseState);
    useEffect.mockImplementation((effect) => effect()); // Mock useEffect to immediately invoke the effect

    // Mock fetch function and response data
    global.fetch = jest.fn(() => Promise.resolve({ ok: true }));

    // Render the Requests component
    const { getByTestId } = render(<Requests />);

    // Simulate a click on delete button for a request
    const deleteButton = getByTestId('delete-button-1'); // Assuming the button has a testID with id 1
    fireEvent.click(deleteButton);

    // Wait for the delete request to be processed
    await waitFor(() => {
      // Check if the entry is removed from the table
      const deletedRequest = getByTestId('request-1'); // Assuming the deleted row has a testID with id 1
      expect(deletedRequest).not.toBeInTheDocument();
    });

    // Check if fetch function was called with the correct URL and method
    expect(global.fetch).toHaveBeenCalledWith('https://cs495-scheduler-3d74a13dd60d.herokuapp.com:443/delete-requests', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 1 }) // Assuming the delete button is associated with id 1
    });
  });
});
