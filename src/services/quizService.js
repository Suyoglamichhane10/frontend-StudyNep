import API from './api';

// Get all available quizzes (public)
export const getQuizzes = () => API.get('/quiz/get');

// Get single quiz by ID (for taking)
export const getQuizById = (id) => API.get(`/quiz/${id}`);

// Submit quiz attempt
export const submitQuizAttempt = (id, data) => API.post(`/quiz/${id}/attempt`, data);

// Get user's past attempts
export const getUserAttempts = () => API.get('/quiz/attempts');

// Teacher routes (optional for later)
export const createQuiz = (data) => API.post('/quiz', data);
export const updateQuiz = (id, data) => API.put(`/quiz/${id}`, data);
export const deleteQuiz = (id) => API.delete(`/quiz/${id}`);
export const getTeacherQuizzes = () => API.get('/quiz/teacher/quizzes');