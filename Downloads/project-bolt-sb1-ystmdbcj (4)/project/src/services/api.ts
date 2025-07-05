import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://memocast1.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  demoLogin: () => api.post('/auth/demo-login'),
  login: (credentials: { email: string; password: string }) => 
    api.post('/auth/login', credentials),
  register: (userData: { username: string; email: string; password: string }) => 
    api.post('/auth/register', userData),
  googleLogin: (data: { credential: string }) => 
    api.post('/auth/google-login', data),
  linkedinLogin: (data: { code: string }) => 
    api.post('/auth/linkedin-login', data),
  linkedinPost: (data: { content: string }) => 
    api.post('/auth/linkedin-post', data),
  twitterPost: (data: { content: string }) => 
    api.post('/auth/twitter-post', data),
  instagramPost: (data: { content: string }) => 
    api.post('/auth/instagram-post', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data: { username: string; email: string }) => 
    api.put('/auth/profile', data),
  updatePreferences: (data: any) => 
    api.put('/auth/preferences', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) => 
    api.put('/auth/password', data),
  exportData: () => api.get('/auth/export'),
  deleteAccount: () => api.delete('/auth/account'),
};

export const notesAPI = {
  getNotes: (params?: any) => api.get('/notes', { params }),
  getNote: (id: string) => api.get(`/notes/${id}`),
  createNote: (formData: FormData) => {
    return api.post('/notes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  updateNote: (id: string, note: any) => api.put(`/notes/${id}`, note),
  deleteNote: (id: string) => api.delete(`/notes/${id}`),
  enhanceNote: (id: string, data: { platform: string; personalityId: string; enhanceType?: string }) => 
    api.post(`/notes/${id}/enhance`, data),
  enhanceContent: (data: { content: string; enhanceType: string; personalityId?: string; format?: string }) =>
    api.post('/notes/enhance', data),
  getStats: () => api.get('/notes/stats/overview'),
};

export const foldersAPI = {
  getFolders: () => api.get('/folders'),
  createFolder: (folder: any) => api.post('/folders', folder),
  updateFolder: (id: string, folder: any) => api.put(`/folders/${id}`, folder),
  deleteFolder: (id: string) => api.delete(`/folders/${id}`),
};

export const personalitiesAPI = {
  getPersonalities: () => api.get('/personalities'),
  createPersonality: (personality: any) => api.post('/personalities', personality),
  updatePersonality: (id: string, personality: any) => api.put(`/personalities/${id}`, personality),
  deletePersonality: (id: string) => api.delete(`/personalities/${id}`),
  switchPersonality: (id: string) => api.put(`/personalities/switch/${id}`),
};

export const draftsAPI = {
  getDrafts: () => api.get('/drafts'),
  createDraft: (draft: any) => api.post('/drafts', draft),
  updateDraft: (id: string, draft: any) => api.put(`/drafts/${id}`, draft),
  deleteDraft: (id: string) => api.delete(`/drafts/${id}`),
  publishDraft: (id: string) => api.post(`/drafts/${id}/publish`),
};

export default api;