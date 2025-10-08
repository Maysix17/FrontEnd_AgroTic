import type { TipoCultivoData, ApiResponse } from "../types/tipoCultivo.types";

const API_URL = "http://localhost:3000/tipo-cultivos";

// CREATE
export const registerTipoCultivo = async (
  cultivoData: TipoCultivoData
): Promise<ApiResponse> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cultivoData),
  });

  if (!response.ok) {
    throw new Error("Error al registrar el tipo de cultivo");
  }

  return response.json();
};

// READ ALL
export const getTipoCultivos = async (): Promise<TipoCultivoData[]> => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Error al obtener los tipos de cultivo");
  }

  return response.json();
};

// UPDATE
export const updateTipoCultivo = async (
  id: string,
  cultivoData: TipoCultivoData
): Promise<ApiResponse> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cultivoData),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar el tipo de cultivo");
  }

  return response.json();
};

// DELETE
export const deleteTipoCultivo = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al eliminar el tipo de cultivo");
  }
};
