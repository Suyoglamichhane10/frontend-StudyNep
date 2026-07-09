import API from './api';

const multipartConfig = {
  headers: { 'Content-Type': 'multipart/form-data' },
};

export const getAssignments = () => API.get('/assignments');
export const createAssignment = (formData) => API.post('/assignments', formData, multipartConfig);
export const updateAssignment = (id, formData) => API.put(`/assignments/${id}`, formData, multipartConfig);
export const deleteAssignment = (id) => API.delete(`/assignments/${id}`);
export const submitAssignment = (id, formData) => API.post(`/assignments/${id}/submit`, formData, multipartConfig);

export const assignmentFileUrl = (assignmentId, fileType = 'attachment', submissionId = '', download = false) => {
  const token = localStorage.getItem('token');
  const submissionPath = submissionId ? `/${submissionId}` : '';
  const params = new URLSearchParams();
  if (token) params.set('token', token);
  if (download) params.set('download', 'true');
  return `http://localhost:5000/api/assignments/${assignmentId}/files/${fileType}${submissionPath}?${params.toString()}`;
};
