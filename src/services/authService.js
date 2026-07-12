import API from './api';

export const register = (userData) => API.post('/auth/register', userData);
export const login = (credentials) => API.post('/auth/login', credentials);
export const forgotPassword = (email) => API.post('/auth/forgot-password', { email });
export const resetPassword = (token, password) => API.post(`/auth/reset-password/${token}`, { password });
export const getCurrentUser = () => API.get('/auth/me');
export const logout = () => API.post('/auth/logout');
