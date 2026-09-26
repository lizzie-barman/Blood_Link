import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bloodlink_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'API request failed';

    console.warn(
      `[BloodLink API Error] ${error.config?.url || ''}:`,
      message
    );

    return Promise.reject(new Error(message));
  }
);

// ==========================================
// AUTHENTICATION
// ==========================================

export const registerUser = (data) =>
  apiClient.post('/auth/register', data);

export const loginUser = (data) =>
  apiClient.post('/auth/login', data);

export const getCurrentUser = () =>
  apiClient.get('/auth/me');

export const logoutUser = () => {
  localStorage.removeItem('bloodlink_token');
  localStorage.removeItem('bloodlink_user');
};

// ==========================================
// BLOOD BANKS
// ==========================================

export const getBloodBanks = () =>
  apiClient.get('/blood-banks');

export const searchBloodBanks = (filters = {}) =>
  apiClient.get('/blood-banks/search', {
    params: filters
  });

export const getBloodBank = (id) =>
  apiClient.get(`/blood-banks/${id}`);

// ==========================================
// DONORS
// ==========================================

export const registerDonor = (data) =>
  apiClient.post('/donors/register', data);

export const getDonors = () =>
  apiClient.get('/donors');

export const getDonorProfile = () =>
  apiClient.get('/donors/profile');

export const getDonor = (id) =>
  apiClient.get(`/donors/${id}`);

export const updateDonor = (id, data) =>
  apiClient.put(`/donors/${id}`, data);

export const updateDonorAvailability = (id, available) =>
  apiClient.put(`/donors/${id}/availability`, {
    available
  });

// ==========================================
// HOSPITALS
// ==========================================

export const createHospital = (data) =>
  apiClient.post('/hospitals', data);

export const getHospitals = () =>
  apiClient.get('/hospitals');

export const getHospital = (id) =>
  apiClient.get(`/hospitals/${id}`);

export const createHospitalRequest = (data) =>
  apiClient.post('/hospitals/request', data);

export const getHospitalRequests = (id) =>
  apiClient.get(`/hospitals/${id}/requests`);

// ==========================================
// EMERGENCY REQUESTS
// ==========================================

export const createEmergencyRequest = (data) =>
  apiClient.post('/requests', data);

export const getEmergencyRequests = (params = {}) =>
  apiClient.get('/requests', {
    params
  });

export const getEmergencyRequest = (id) =>
  apiClient.get(`/requests/${id}`);

export const acceptRequest = (id, donorId) =>
  apiClient.put(`/requests/${id}/accept`, {
    donorId
  });

export const declineRequest = (id, donorId) =>
  apiClient.put(`/requests/${id}/decline`, {
    donorId
  });

export const fulfillRequest = (id) =>
  apiClient.put(`/requests/${id}/fulfill`);

export const cancelRequest = (id) =>
  apiClient.put(`/requests/${id}/cancel`);

export const escalateRequest = (id, radius) =>
  apiClient.post(`/requests/${id}/escalate`, {
    radius
  });

// ==========================================
// BLOOD BANK INVENTORY
// ==========================================

export const getInventory = (bankId) =>
  bankId
    ? apiClient.get('/blood-banks/inventory', {
        params: {
          bloodBankId: bankId
        }
      })
    : apiClient.get('/blood-banks/inventory');

export const updateInventory = (id, data) =>
  apiClient.put(`/blood-banks/inventory/${id}`, data);

export default {
  client: apiClient,

  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,

  getBloodBanks,
  searchBloodBanks,
  getBloodBank,

  registerDonor,
  getDonors,
  getDonorProfile,
  getDonor,
  updateDonor,
  updateDonorAvailability,

  createHospital,
  getHospitals,
  getHospital,
  createHospitalRequest,
  getHospitalRequests,

  createEmergencyRequest,
  getEmergencyRequests,
  getEmergencyRequest,
  acceptRequest,
  declineRequest,
  fulfillRequest,
  cancelRequest,
  escalateRequest,

  getInventory,
  updateInventory
};