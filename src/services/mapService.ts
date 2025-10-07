// en src/services/mapService.ts
import type { MapData, ApiResponse } from "../types/map.types";

const API_URL = "http://localhost:3000/maps"; // cambia si tu backend es otro

export const registerMap = async (mapData: MapData): Promise<ApiResponse> => {
  const formData = new FormData();
  formData.append("nombre", mapData.nombre);
  if (mapData.imagen) {
    formData.append("imagen", mapData.imagen);
  }

  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Error al registrar el mapa");
  }

  return response.json();
};
