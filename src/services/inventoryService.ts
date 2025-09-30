import apiClient from '../lib/axios/axios';

export interface Categoria {
  id: string;
  nombre: string;
}

export interface Bodega {
  id: string;
  nombre: string;
}

export interface CreateInventoryDto {
  nombre: string;
  descripcion?: string;
  stock: number;
  precio: number;
  capacidadUnidad?: number;
  fechaVencimiento?: string;
  fkCategoriaId: string;
  fkBodegaId: string;
  imgUrl?: File;
}

export const inventoryService = {
  create: async (data: CreateInventoryDto): Promise<any> => {
    const formData = new FormData();
    formData.append('nombre', data.nombre);
    if (data.descripcion) formData.append('descripcion', data.descripcion);
    formData.append('stock', data.stock.toString());
    formData.append('precio', data.precio.toString());
    if (data.capacidadUnidad) formData.append('capacidadUnidad', data.capacidadUnidad.toString());
    if (data.fechaVencimiento) formData.append('fechaVencimiento', data.fechaVencimiento);
    formData.append('fkCategoriaId', data.fkCategoriaId);
    formData.append('fkBodegaId', data.fkBodegaId);
    if (data.imgUrl) formData.append('imgUrl', data.imgUrl);

    const response = await apiClient.post('/inventario', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getCategorias: async (): Promise<Categoria[]> => {
    const response = await apiClient.get('/categoria');
    return response.data;
  },

  getBodegas: async (): Promise<Bodega[]> => {
    const response = await apiClient.get('/bodega');
    return response.data;
  },
};