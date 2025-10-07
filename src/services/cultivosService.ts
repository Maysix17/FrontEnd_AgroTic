import type { Cultivo, SearchCultivoDto } from "../types/cultivos.types";

const API_URL = "http://localhost:3000";

export const searchCultivos = async (
  searchData: SearchCultivoDto
): Promise<Cultivo[]> => {
  const response = await fetch(`${API_URL}/cultivos/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(searchData),
  });

  if (!response.ok) {
    throw new Error("Error al buscar cultivos");
  }

  return response.json();
};

export const getAllCultivos = async (): Promise<Cultivo[]> => {
  const response = await fetch(`${API_URL}/cultivos`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Error al obtener cultivos");
  }

  return response.json();
};

export const getCultivosVariedadXZonaByCultivo = async (cultivoId: string): Promise<any[]> => {
  const response = await fetch(`${API_URL}/cultivos-variedad-x-zona/cultivo/${cultivoId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Error al obtener cultivos variedad x zona");
  }

  return response.json();
};

export const getZonaCultivosVariedadXZona = async (zonaId: string): Promise<any> => {
  const response = await fetch(`${API_URL}/zonas/${zonaId}/cultivos-variedad-zona`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Error al obtener zona cultivos variedad x zona");
  }

  return response.json();
};

export const getZonaByNombre = async (nombre: string): Promise<any> => {
  const response = await fetch(`${API_URL}/zonas?nombre=${encodeURIComponent(nombre)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Error al obtener zona por nombre");
  }

  const zonas = await response.json();
  const zona = zonas.find((z: any) => z.nombre === nombre);
  if (!zona) {
    throw new Error(`Zona con nombre ${nombre} no encontrada`);
  }
  return zona;
};