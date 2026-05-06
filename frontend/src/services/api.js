import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';


axios.defaults.withCredentials = true
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
 



// services/api.js - Add these methods
export const contactAPI = {
  getHistory: (page, limit, filters) => {
    let url = `/contact/history?page=${page}&limit=${limit}`;
    if (filters.search) url += `&search=${encodeURIComponent(filters.search)}`;
    return api.get(url);
  },
  
  getContactById: (id) => api.get(`/contact/${id}`),
  
  markAsRead: (contactId) => api.put('/see', { contactId }),
  
  markAllAsRead: () => api.put('/see-all'),
};


// Assistant API
export const assistantAPI = {
  getResponse: (message, contactData) =>
    api.post('/assistant', { message, contactData }),
};

export default api;


