import apiClient from "../lib/axios/axios";
import type { RegisterPayload, RegisterFormData, LoginPayload, DecodedToken } from "../types/Auth";
import { jwtDecode } from 'jwt-decode';

export const registerUser = async (
  formData: RegisterFormData
): Promise<any> => {

  console.log(apiClient)
  try {
    // Mapeo y conversión de datos para el backend
    const payload: RegisterPayload = {
      nombres: formData.nombres,
      apellidos: formData.apellidos,
      dni: parseInt(formData.dni, 10),
      telefono: parseInt(formData.telefono, 10),
      correo: formData.email, // Mapeo de 'email' a 'correo'
      password: formData.password,
    };
    console.log(payload)


    const response = await apiClient.post("/auth/register", payload);


    return response.data;

    console.log(payload)
    console.log(response)

  } catch (error) {
    console.error("Error en el registro:", error);
    // Puedes manejar el error de forma más específica si lo necesitas
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    // Placeholder for potential backend logout call
    // await apiClient.post("/auth/logout");

  } catch (error) {
    console.error("Error during logout:", error);
    throw error;
  }
};

export const loginUser = async (payload: LoginPayload): Promise<DecodedToken> => {
  try {
    const response = await apiClient.post("/auth/login", payload);
    const token = response.data.access_token;
    localStorage.setItem("access_token", token);
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const refreshToken = async (): Promise<DecodedToken> => {
  try {
    const response = await apiClient.post("/auth/refresh");
    const token = response.data.access_token;
    localStorage.setItem("access_token", token);
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error("Refresh failed:", error);
    throw error;
  }
};

export const getToken = (): string | null => {
  return localStorage.getItem("access_token");
};

export const decodeToken = (token: string): DecodedToken => {
  return jwtDecode<DecodedToken>(token);
};
