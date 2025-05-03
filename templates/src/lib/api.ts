import axios from 'axios';

const API_BASE_URL = 'http://localhost:8001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface URLRequest {
  url: string;
}

export interface QueryRequest {
  question: string;
  url?: string;
}

export interface QueryResponse {
  response: string;
  sources?: string[];
  error?: string;
}

export const apiService = {
  ingestUrl: async (url: string) => {
    const response = await api.post<{ message: string }>('/ingest', { url });
    return response.data;
  },

  query: async (question: string, url?: string) => {
    const response = await api.post<QueryResponse>('/query', { question, url });
    return response.data;
  },

  resetIndex: async () => {
    const response = await api.post<{ message: string }>('/reset');
    return response.data;
  },
}; 