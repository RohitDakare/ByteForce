import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  googleLogin: async (token: string) => {
    const response = await api.post('/auth/google', { token });
    return response.data;
  },
};

// Skills API
export const skillsAPI = {
  getSkills: async () => {
    const response = await api.get('/skills');
    return response.data;
  },

  addSkill: async (skill: { name: string; level: number; category: string }) => {
    const response = await api.post('/skills', skill);
    return response.data;
  },

  updateSkill: async (id: number, skill: { name?: string; level?: number; category?: string }) => {
    const response = await api.put(`/skills/${id}`, skill);
    return response.data;
  },

  deleteSkill: async (id: number) => {
    const response = await api.delete(`/skills/${id}`);
    return response.data;
  },
};
