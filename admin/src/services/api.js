import axios from 'axios';

const api = axios.create({
  baseURL: 'https://mmust-dcbt-api.vercel.app/api/v1',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  const { token, user } = response.data;
  
  if (user.role !== 'admin') {
    throw new Error('Access denied. Admin privileges required.');
  }

  localStorage.setItem('admin_token', token);
  localStorage.setItem('admin_user', JSON.stringify(user));
  return response.data;
};

export const register = async (name, email, password) => {
  const response = await api.post('/auth/register', { 
    name, 
    email, 
    password, 
    role: 'admin' 
  });
  const { token, user } = response.data;
  
  localStorage.setItem('admin_token', token);
  localStorage.setItem('admin_user', JSON.stringify(user));
  return response.data;
};

export const getMetrics = async (range = '7d') => {
  const response = await api.get(`/admin/metrics?range=${range}`);
  return response.data.data;
};

export const getUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data.data;
};

export const getUserDetails = async (id) => {
  const response = await api.get(`/admin/users/${id}`);
  return response.data.data;
};

export const getCrisisReports = async () => {
  const response = await api.get('/admin/crisis');
  return response.data.data;
};

export const getLogs = async (category = 'all') => {
  const response = await api.get(`/admin/logs?category=${category}`);
  return response.data.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await api.put('/auth/profile', data);
  return response.data;
};

export const updatePreferences = async (data) => {
  const response = await api.put('/auth/preferences', data);
  return response.data;
};

export const changePassword = async (data) => {
  const response = await api.put('/auth/password', data);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
  window.location.href = '/login';
};

export default api;
