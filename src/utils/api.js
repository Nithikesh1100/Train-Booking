// src/utils/api.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }
  console.log(data);
  return data;
};

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const login = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
};

export const signup = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

export const getBookings = async () => {
  const response = await fetch(`${API_BASE_URL}/reservations`, {
    headers: getAuthHeader(),
  });
  return handleResponse(response);
};

export const createBooking = async (bookingData) => {
  const response = await fetch(`${API_BASE_URL}/reservations`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify(bookingData),
  });
  return handleResponse(response);
};

// export const cancelBooking = async (bookingId) => {
//   const response = await fetch(`${API_BASE_URL}/reservations/${bookingId}`, {
//     method: 'DELETE',
//     headers: getAuthHeader(),
//   });
//   return handleResponse(response);
// };

export const cancelBooking = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reservations/reset`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });
  
      if (!response.ok) {
        throw new Error('Failed to reset the booking');
      }
  
      const result = await response.json();
      return result;  // Return the response from the backend, which should confirm the reset
    } catch (error) {
      console.error('Error canceling booking:', error);
      throw error;  // Rethrow the error so it can be handled by the calling function
    }
  };
  

  export const logout = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeader(),
    });
    if (response.ok) {
      localStorage.removeItem('token'); // Remove token after successful logout
      return { message: 'Logged out successfully' };
    } else {
      const error = await response.json();
      throw new Error(error.message || 'Failed to log out.');
    }
  };