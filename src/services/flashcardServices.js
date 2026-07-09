import API from './api';

export const getFlashcards = () => API.get('/flashcards');
export const createFlashcard = (data) => API.post('/flashcards', data);
export const updateFlashcard = (id, data) => API.put(`/flashcards/${id}`, data);
export const deleteFlashcard = (id) => API.delete(`/flashcards/${id}`);