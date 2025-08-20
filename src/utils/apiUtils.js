// utils/apiUtils.js
import axios from 'axios';

const API_BASE_URL = 'https://tabib.zeabur.app/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const userType = sessionStorage.getItem('userType');
    if (userType === 'patient') {
    config.withCredentials = true;
  } else {
    config.withCredentials = false;
  }
  
  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 404) {
      // Clear sessionStorage on auth failure
      sessionStorage.removeItem('userId');
      sessionStorage.removeItem('userType');
      sessionStorage.removeItem('userEmail');
      sessionStorage.removeItem('userName');
      
      // Redirect to login (you might want to use a callback for this)
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API methods
export const authAPI = {
  // Login for both user types
  login: async (userType, credentials) => {
    const endpoint = userType === 'patient' ? '/patients/login' : '/docteurs/login';
    const config = userType === 'patient' ? { withCredentials: true } : { withCredentials: false };
    
    return api.post(endpoint, credentials, config);
  },

  // Logout (only for patients)
  logout: async (userType) => {
    if (userType === 'patient') {
      return api.post('/patients/logout', {}, { withCredentials: true });
    }
    // For doctors, just resolve immediately since they don't have server sessions
    return Promise.resolve();
  },

  // Get current user profile - now uses consistent /{userId} endpoint for both types
  getCurrentUser: async (userType, userId) => {
    if (userType === 'patient') {
      // Patients now use /{userId} endpoint with sessions
      return api.get(`/patients/${userId}`);
    } else {
      // Doctors use /{id} endpoint without sessions
      return api.get(`/docteurs/${userId}`);
    }
  },

  // Update user profile
  updateUser: async (userType, userId, userData) => {
    const endpoint = userType === 'patient' ? `/patients/${userId}` : `/docteurs/${userId}`;
    return api.put(endpoint, userData);
  },

  // Delete user profile
  deleteUser: async (userType, userId) => {
    const endpoint = userType === 'patient' ? `/patients/${userId}` : `/docteurs/${userId}`;
    return api.delete(endpoint);
  },

  // Search doctors
  searchDoctors: (specialite, city) => {
    const params = new URLSearchParams();
    params.append('specialite', specialite);
    if (city) params.append('city', city);
    
    return api.get(`/docteurs/search?${params}`);
  }
};

// General API methods
export const generalAPI = {
  // Get all doctors
  getAllDoctors: () => api.get('/docteurs'),
  
  // Get doctor by id
  getDoctorById: (id) => api.get(`/docteurs/${id}`),
  
  // Create new user
  createUser: (userType, userData) => {
    const endpoint = userType === 'patient' ? '/patients' : '/docteurs';
    const config = userType === 'patient' ? { withCredentials: true } : { withCredentials: false };
    return api.post(endpoint, userData, config);
  }
};

export default api;