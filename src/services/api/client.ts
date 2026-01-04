import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';

// TODO: Replace with your actual API URL
const BASE_URL = 'http://10.137.121.203:8000/api'; // Android emulator localhost
// const BASE_URL = 'http://localhost:8000/api'; // iOS simulator
// For physical device, use your computer's local IP: http://192.168.x.x:8000/api

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired - clear storage
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync('user_data');
    }
    return Promise.reject(error);
  }
);

export const attendanceService = {
  getDashboard: () => apiClient.get('/dashboard/employee'),
  checkIn: (data: any) => apiClient.post('/attendance/check-in', data),
  checkOut: (data: any) => apiClient.post('/attendance/check-out', data),
  getHistory: (days: number = 30) => apiClient.get(`/attendance/history?days=${days}`),
  getTodayStatus: (employeeId: number) => apiClient.get(`/attendance/today?employee_id=${employeeId}`),
};

export const authService = {
  login: (data: any) => apiClient.post('/auth/login', data),
  register: (data: any) => apiClient.post('/auth/register', data),
  logout: () => apiClient.post('/auth/logout'),
  getProfile: () => apiClient.get('/auth/profile'),
  joinCompany: (short_code: string) => apiClient.post('/auth/join-company', { short_code }),
  createCompany: (data: any) => apiClient.post('/auth/register-company', data),
};

export const ownerService = {
  getDashboard: (companyId: number) => apiClient.get(`/dashboard/owner?company_id=${companyId}`),
};

export const companyService = {
  getDetails: (companyId: number) => apiClient.get(`/companies/${companyId}`),
  updateSettings: (companyId: number, data: any) => apiClient.put(`/companies/${companyId}`, data),
  getEmployees: (companyId: number, status: string = 'APPROVED') => apiClient.get(`/companies/${companyId}/employees?status=${status}`),
  getPendingEmployees: (companyId: number) => apiClient.get(`/companies/${companyId}/pending-employees`),
};

export const employeeService = {
  approve: (employeeId: number) => apiClient.post(`/employees/${employeeId}/approve`),
  reject: (employeeId: number) => apiClient.post(`/employees/${employeeId}/reject`),
  evaluate: (employeeId: number, data: any) => apiClient.post(`/employees/${employeeId}/evaluation`, data),
};
