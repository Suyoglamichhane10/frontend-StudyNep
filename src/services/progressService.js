import API from './api';

// ==================== Progress Tracking ====================

// Get all progress data (main progress endpoint)
export const getProgress = () => API.get('/progress');
export const getProgressData = () => API.get('/progress');

// Dashboard Stats
export const getDashboardStats = () => API.get('/progress/stats');

// Weekly Progress (study hours per day)
export const getWeeklyProgress = () => API.get('/progress/weekly');

// Performance Data (Quiz Scores)
export const getPerformanceData = () => API.get('/progress/performance');
export const getPerformanceTrend = () => API.get('/progress/performance');

// Recent Activities
export const getActivities = () => API.get('/progress/activities');
export const getRecentActivities = () => API.get('/progress/activities');

// Study Streak
export const getStudyStreak = () => API.get('/progress/streak');
export const updateStreak = () => API.put('/progress/streak');

// Achievements
export const getAchievements = () => API.get('/progress/achievements');

// Subject Progress
export const getSubjectProgress = (subjectId) => API.get(`/progress/subject/${subjectId}`);
export const getAllSubjectsProgress = () => API.get('/progress/subjects');

// Quiz Scores
export const submitQuizScore = (data) => API.post('/progress/quiz', data);
export const getQuizScores = (subject) => API.get(`/progress/quiz${subject ? `?subject=${subject}` : ''}`);

// Study Logging
export const logStudySession = (data) => API.post('/progress/study', data);
export const updateProgress = (data) => API.post('/progress', data);

// Goals
export const setStudyGoal = (data) => API.post('/progress/goal', data);
export const getStudyGoal = () => API.get('/progress/goal');

// Export Data
export const exportProgressData = () => API.get('/progress/export');