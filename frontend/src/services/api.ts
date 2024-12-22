import axios from 'axios';
import { LoginCredentials, RegisterCredentials, Goal, Reflection } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials: LoginCredentials) =>
    api.post('/users/login/', credentials),
  register: (credentials: RegisterCredentials) =>
    api.post('/users/register/', credentials),
  refreshToken: (refresh: string) =>
    api.post('/users/token/refresh/', { refresh }),
};

export const goalsAPI = {
  getAll: () => api.get<Goal[]>('/goals/'),
  getById: (id: number) => api.get<Goal>(`/goals/${id}/`),
  create: (goal: Partial<Goal>) => api.post<Goal>('/goals/', goal),
  update: (id: number, goal: Partial<Goal>) =>
    api.put<Goal>(`/goals/${id}/`, goal),
  delete: (id: number) => api.delete(`/goals/${id}/`),
};

export const reflectionsAPI = {
  getAll: () => api.get<Reflection[]>('/reflections/'),
  getById: (id: number) => api.get<Reflection>(`/reflections/${id}/`),
  create: (formData: FormData) =>
    api.post<Reflection>('/reflections/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  update: (id: number, reflection: Partial<Reflection>) =>
    api.put<Reflection>(`/reflections/${id}/`, reflection),
  delete: (id: number) => api.delete(`/reflections/${id}/`),
};