import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// User API
export const userAPI = {
  login: (email, password) =>
    api.post('/user/authenticate', { email, password }),
  logout: () =>
    api.post('/user/logout'),
  getProfile: () =>
    api.get('/user/profile'),
  register: (userData) =>
    api.post('/user/register', userData),
};
 



// Contact API
export const contactAPI = {
  submit: (contactData) =>
    api.post('/contact/support', contactData),
  getHistory: (page = 1, limit = 10, filters = {}) =>
    api.get('/contact/history', { params: { page, limit, ...filters } }),
  getContact: (id) =>
    api.get(`/contact/${id}`),
  updateContact: (id, data) =>
    api.put(`/contact/${id}`, data),
  markAsRead: (id) =>
    api.patch(`/contact/${id}/read`, {}),
  updateFlag: (id, flag) =>
    api.patch(`/contact/${id}/flag`, { flag }),
};

// Assistant API
export const assistantAPI = {
  getResponse: (message, contactData) =>
    api.post('/assistant', { message, contactData }),
};

export default api;


