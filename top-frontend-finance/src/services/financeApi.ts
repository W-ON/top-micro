import axios from 'axios';
import { Finance, FinanceFormData } from '../types/finance';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const financeApi = {
  getAll: async (): Promise<Finance[]> => {
    const response = await api.get<Finance[]>('/finance');
    return response.data;
  },

  getById: async (id: number): Promise<Finance> => {
    const response = await api.get<Finance>(`/finance/${id}`);
    return response.data;
  },

  getByUserId: async (userId: number): Promise<Finance[]> => {
    const response = await api.get<Finance[]>(`/finance/user/${userId}`);
    return response.data;
  },

  create: async (data: FinanceFormData): Promise<Finance> => {
    const response = await api.post<Finance>('/finance', data);
    return response.data;
  },

  update: async (id: number, data: FinanceFormData): Promise<Finance> => {
    const response = await api.put<Finance>(`/finance/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/finance/${id}`);
  },
};
