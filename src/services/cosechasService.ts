import axios from 'axios';
import type { Cosecha } from '../types/cosechas.types';

const API_BASE_URL = 'http://localhost:3000';

export const createCosecha = async (data: Omit<Cosecha, 'id'>): Promise<Cosecha> => {
  const response = await axios.post(`${API_BASE_URL}/cosechas`, data);
  return response.data;
};

export const getCosechas = async (): Promise<Cosecha[]> => {
  const response = await axios.get(`${API_BASE_URL}/cosechas`);
  return response.data;
};

export const updateCosecha = async (id: string, data: Partial<Cosecha>): Promise<Cosecha> => {
  const response = await axios.patch(`${API_BASE_URL}/cosechas/${id}`, data);
  return response.data;
};

export const deleteCosecha = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/cosechas/${id}`);
};