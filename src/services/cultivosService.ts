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