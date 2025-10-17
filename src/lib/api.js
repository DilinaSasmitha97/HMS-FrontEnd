import axios from 'axios';

// For now, hard-code localhost; consider moving to env (import.meta.env.VITE_API_URL)
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach admin token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Patient-scoped API instance (does not mix with admin token)
export const patientApi = axios.create({
  baseURL: API_BASE_URL,
});
patientApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('patient_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Doctor-scoped API instance
export const doctorApi = axios.create({ baseURL: API_BASE_URL });
doctorApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('doctor_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Lab-scoped API instance
export const labApi = axios.create({ baseURL: API_BASE_URL });
labApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('lab_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
