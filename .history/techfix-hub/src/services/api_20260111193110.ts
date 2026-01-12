const API_BASE_URL = 'http://localhost:3000/api';

export const userAPI = {
  // Login
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  // Register
  register: async (userData: { name: string; email: string; phone: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/user/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  // Create booking
  createBooking: async (bookingData: {
    customerId: string;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    service: string;
    date: string;
    time: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/user/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    });
    return response.json();
  },

  // Get user bookings
  getBookings: async (customerId: string) => {
    const response = await fetch(`${API_BASE_URL}/user/bookings/${customerId}`);
    return response.json();
  },

  // Get booking details
  getBookingDetails: async (bookingId: string) => {
    const response = await fetch(`${API_BASE_URL}/user/booking/${bookingId}`);
    return response.json();
  },

  // Rate booking
  rateBooking: async (bookingId: string, rating: number) => {
    const response = await fetch(`${API_BASE_URL}/user/bookings/${bookingId}/rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating }),
    });
    return response.json();
  },
};
