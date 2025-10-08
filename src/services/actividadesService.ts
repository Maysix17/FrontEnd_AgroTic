import apiClient from '../lib/axios/axios';

export interface Actividad {
  id: string;
  descripcion: string;
  fechaAsignacion: string;
  horasDedicadas: number;
  observacion: string;
  estado: boolean;
  fkCultivoVariedadZonaId: string;
  fkCategoriaActividadId: string;
  imgUrl?: string;
}

export interface CreateActividadData {
  descripcion: string;
  fechaAsignacion: string;
  horasDedicadas: number;
  observacion: string;
  estado: boolean;
  fkCultivoVariedadZonaId: string;
  fkCategoriaActividadId: string;
}

export interface UsuarioXActividad {
  fkUsuarioId: string;
  fkActividadId: string;
  fechaAsignacion: Date;
}

export interface InventarioXActividad {
  fkInventarioId: string;
  fkActividadId: string;
  cantidadUsada: number;
}

export interface Movimiento {
  fkInventarioId: string;
  stockReservado?: number;
  stockDevuelto?: number;
  stockDevueltoSobrante?: number;
  stockReservadoSobrante?: number;
}

export const getActividadesByDateRange = async (start: string, end: string): Promise<Actividad[]> => {
  const response = await apiClient.get(`/actividades/by-date-range?start=${start}&end=${end}`);
  return response.data;
};

export const getActividadesCountByDate = async (date: string): Promise<number> => {
  const response = await apiClient.get(`/actividades/count-by-date/${date}`);
  return response.data;
};

export const getActividadesByDate = async (date: string): Promise<Actividad[]> => {
  const response = await apiClient.get(`/actividades/by-date/${date}`);
  return response.data;
};

export const getActividadesByDateWithActive = async (date: string): Promise<Actividad[]> => {
  const response = await apiClient.get(`/actividades/by-date-active/${date}`);
  return response.data;
};

export const createActividad = async (data: CreateActividadData): Promise<Actividad> => {
  const response = await apiClient.post('/actividades', data);
  return response.data;
};

export const updateActividad = async (id: string, data: Partial<Actividad>): Promise<void> => {
  await apiClient.patch(`/actividades/${id}`, data);
};

export const deleteActividad = async (id: string): Promise<void> => {
  await apiClient.delete(`/actividades/${id}`);
};

export const uploadActividadEvidence = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post('/actividades/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const createUsuarioXActividad = async (data: UsuarioXActividad): Promise<void> => {
  await apiClient.post('/usuarios-x-actividades', data);
};

export const createInventarioXActividad = async (data: InventarioXActividad): Promise<void> => {
  await apiClient.post('/inventario-x-actividades', data);
};

export const createMovimiento = async (data: Movimiento): Promise<void> => {
  await apiClient.post('/movimientos', data);
};

export const finalizarActividad = async (id: string, data: { observacion?: string; imgUrl?: File; horas?: number; precioHora?: number }): Promise<void> => {
  const formData = new FormData();
  if (data.observacion) formData.append('observacion', data.observacion);
  if (data.imgUrl) formData.append('imgUrl', data.imgUrl);
  if (data.horas !== undefined) formData.append('horas', data.horas.toString());
  if (data.precioHora !== undefined) formData.append('precioHora', data.precioHora.toString());
  await apiClient.patch(`/actividades/${id}/finalizar`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};