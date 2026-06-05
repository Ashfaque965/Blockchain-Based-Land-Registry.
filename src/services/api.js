import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

// Property Services
export const propertyService = {
  registerProperty: (data) => api.post('/properties', data),
  getProperty: (propertyId) => api.get(`/properties/${propertyId}`),
  getAllProperties: (page = 1, limit = 20) => 
    api.get(`/properties?page=${page}&limit=${limit}`),
  getPropertiesByOwner: (owner, page = 1, limit = 10) => 
    api.get(`/properties/owner/${owner}?page=${page}&limit=${limit}`),
  updateProperty: (propertyId, data) => api.put(`/properties/${propertyId}`, data)
};

// Transfer Services
export const transferService = {
  transferProperty: (data) => api.post('/transfers', data),
  getTransactionHistory: (propertyId, page = 1, limit = 10) => 
    api.get(`/transfers/property/${propertyId}?page=${page}&limit=${limit}`),
  getOwnerTransactions: (owner, page = 1, limit = 10) => 
    api.get(`/transfers/owner/${owner}?page=${page}&limit=${limit}`),
  getTransactionDetails: (transactionId) => api.get(`/transfers/${transactionId}`)
};

// Verification Services
export const verificationService = {
  verifyOwnership: (data) => api.post('/verify/ownership', data),
  verifyTransactionHistory: (propertyId) => api.get(`/verify/history/${propertyId}`),
  getAuditTrail: (propertyId, startDate, endDate) => 
    api.get(`/verify/audit/${propertyId}`, { params: { startDate, endDate } }),
  generateCertificate: (propertyId) => api.get(`/verify/certificate/${propertyId}`)
};

export default api;
