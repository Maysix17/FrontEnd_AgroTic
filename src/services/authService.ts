import apiClient from "../lib/axios/axios";
import type {
  RegisterPayload,
  RegisterFormData,
  LoginPayload,
  LoginResponse,
} from "../types/Auth";

export const registerUser = async (
  formData: RegisterFormData
): Promise<any> => {
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

    const response = await apiClient.post("/auth/register", payload);
    return response.data;
  } catch (error) {
    console.error("Error en el registro:", error);
    // Puedes manejar el error de forma más específica si lo necesitas
    throw error;
  }
};

export const loginUser = async (
  credentials: LoginPayload
): Promise<LoginResponse> => {
  try {
    const payload = {
      ...credentials,
      dni: parseInt(credentials.dni, 10),
    };
    const { data } = await apiClient.post<LoginResponse>(
      "/auth/login",
      payload
    );
    return data;
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    throw error;
  }
};
