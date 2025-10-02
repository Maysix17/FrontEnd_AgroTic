import apiClient from "../lib/axios/axios";

// DTO esperado por tu backend
export interface CreateActividadPayload {
  categoria: string;
  descripcion: string;
  dniUsuario: string;
  nombreInventario?: string;
  fechaInicio: string;
  fkCultivoVariedadZonaId: string;
  nombreZona?: string;   // 👈 agregar
}

export const createActividad = async (payload: CreateActividadPayload): Promise<any> => {
  try {
    const res = await apiClient.post("/actividades", payload);
    return res.data;
  } catch (error: any) {
    console.error("Error creando actividad:", error.response?.data || error.message);
    throw error;
  }
};

export const getActividades = async (): Promise<any[]> => {
  try {
    const res = await apiClient.get("/actividades");
    return res.data;
  } catch (error: any) {
    console.error("Error obteniendo actividades:", error.response?.data || error.message);
    throw error;
  }
};
