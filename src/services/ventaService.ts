import axios from 'axios';
import type { Venta } from '../types/venta.types';

const API_BASE_URL = 'http://localhost:3000';

export const createVenta = async (data: Omit<Venta, 'id'>): Promise<Venta> => {
  const response = await axios.post(`${API_BASE_URL}/venta`, data);
  return response.data;
};

export const getVentas = async (): Promise<Venta[]> => {
  const response = await axios.get(`${API_BASE_URL}/venta`);
  return response.data;
};

export const updateVenta = async (id: string, data: Partial<Venta>): Promise<Venta> => {
  const response = await axios.patch(`${API_BASE_URL}/venta/${id}`, data);
  return response.data;
};

export const deleteVenta = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/venta/${id}`);
};