import API from './api';

export const getStudyPlan = () => API.get('/studyplan');
export const addSubjectsToPlan = (subjectIds) => API.put('/studyplan/add', { subjectIds });
export const removeSubjectFromPlan = (subjectId) => API.delete(`/studyplan/${subjectId}`);