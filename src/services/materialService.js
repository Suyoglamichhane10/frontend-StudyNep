import API from './api';

export const getMaterials = () => API.get('/materials');
export const uploadPDF = (formData) => API.post('/materials/upload-pdf', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const uploadLink = (data) => API.post('/materials/upload-link', data);
export const deleteMaterial = (id) => API.delete(`/materials/${id}`);