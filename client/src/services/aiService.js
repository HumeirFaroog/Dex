import api from './api';

export const aiService = {
  analyzeSymptoms: async (symptoms) => {
    const response = await api.post('/ai/symptoms', { symptoms });
    return response.data;
  },

  analyzeReport: async (reportId, text) => {
    const response = await api.post('/ai/report', { reportId, text });
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/ai');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/ai/${id}`);
    return response.data;
  },

  update: async (id, analysisData) => {
    const response = await api.put(`/ai/${id}`, analysisData);
    return response.data;
  },
};

