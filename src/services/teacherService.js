import API from './api';

export const getTeacherDashboard = () => API.get('/teacher/dashboard');
export const getStudents = () => API.get('/teacher/students');