import type { TipoCultivoData, ApiResponse } from "../types/tipoCultivo.types";

const API_URL = "http://localhost:3000"; 

export const registerTipoCultivo = async (
  cultivoData: TipoCultivoData
): Promise<ApiResponse> => {
  const response = await fetch(`${API_URL}/tipo-cultivos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" }, 
    body: JSON.stringify(cultivoData),
  });

  if (!response.ok) {
    throw new Error("Error al registrar el tipo de cultivo");
  }

  return response.json();
};