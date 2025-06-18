import api from './api';

// Register a new user
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  if (response.data) {
    localStorage.setItem('userInfo', JSON.stringify(response.data));
    localStorage.setItem('userToken', response.data.token);
  }
  return response.data;
};

// Login user
export const login = async (userData) => {
  const response = await api.post('/auth/login', userData);
  if (response.data) {
    localStorage.setItem('userInfo', JSON.stringify(response.data));
    localStorage.setItem('userToken', response.data.token);
  }
  return response.data;
};

// Logout user
export const logout = () => {
  localStorage.removeItem('userInfo');
  localStorage.removeItem('userToken');
};

// Get current user info
export const getCurrentUser = () => {
  const userInfo = localStorage.getItem('userInfo');
  return userInfo ? JSON.parse(userInfo) : null;
};
