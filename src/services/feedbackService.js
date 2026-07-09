import API from './api';

export const getFeedbackForStudent = (studentId) => API.get(`/feedback/student/${studentId}`);
export const createFeedback = (feedback) => API.post('/feedback', feedback);
export const deleteFeedback = (id) => API.delete(`/feedback/${id}`);