import API from './api';

// Stats
export const getAdminStats = () => API.get('/admin/stats');

// User management
export const getAllUsers = (role) => API.get('/admin/users', { params: { role } });
export const getUserById = (id) => API.get(`/admin/users/${id}`);
export const updateUser = (id, userData) => API.put(`/admin/users/${id}`, userData);
export const deleteUser = (id) => API.delete(`/admin/users/${id}`);

// Reports
export const getReports = () => API.get('/admin/reports');

// Feedback management - Now these match your backend routes
export const getAllFeedback = () => API.get('/admin/feedback');
export const getFeedbackById = (id) => API.get(`/admin/feedback/${id}`);
export const deleteFeedback = (id) => API.delete(`/admin/feedback/${id}`);
export const markFeedbackAsRead = (id) => API.patch(`/admin/feedback/${id}/read`);
export const replyToFeedback = (id, data) => API.post(`/admin/feedback/${id}/reply`, data);