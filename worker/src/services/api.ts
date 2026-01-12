const API_BASE_URL = 'http://localhost:3000/api';

export const workerAPI = {
  // Login
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/worker/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  // Get assigned bookings
  getBookings: async (workerId: string) => {
    const response = await fetch(`${API_BASE_URL}/worker/bookings/${workerId}`);
    return response.json();
  },

  // Verify OTP
  verifyOTP: async (bookingId: string, otp: string) => {
    const response = await fetch(`${API_BASE_URL}/worker/bookings/${bookingId}/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ otp }),
    });
    return response.json();
  },

  // Complete booking
  completeBooking: async (bookingId: string, data: {
    serviceCharge: number;
    usedComponents: boolean;
    componentDetails?: string;
    warrantyMonths?: number;
  }) => {
    const response = await fetch(`${API_BASE_URL}/worker/bookings/${bookingId}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Get dashboard stats
  getStats: async (workerId: string) => {
    const response = await fetch(`${API_BASE_URL}/worker/stats/${workerId}`);
    return response.json();
  },
};
