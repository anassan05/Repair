const API_BASE_URL = 'http://localhost:3000/api';

export const adminAPI = {
  // Login
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  // Get all bookings
  getBookings: async (status?: string) => {
    const url = status ? `${API_BASE_URL}/admin/bookings?status=${status}` : `${API_BASE_URL}/admin/bookings`;
    const response = await fetch(url);
    return response.json();
  },

  // Get all workers
  getWorkers: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/workers`);
    return response.json();
  },

  // Assign worker to booking
  assignWorker: async (bookingId: string, workerId: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/bookings/${bookingId}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workerId }),
    });
    return response.json();
  },

  // Update booking status
  updateBookingStatus: async (bookingId: string, status: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return response.json();
  },
};
