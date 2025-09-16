import apiClient from "../lib/axios/axios";
import type { RegisterPayload, RegisterFormData } from "../types/Auth";

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

/**
 * Solicita un enlace de recuperación de contraseña para un correo electrónico.
 * @param email - El correo del usuario.
 */
export const recoverPassword = async (email: string): Promise<any> => {
  try {
    const response = await apiClient.patch("/auth/recover-password", { email });
    return response.data;
  } catch (error) {
    console.error("Error al solicitar la recuperación:", error);
    // Re-lanza el error para que el componente del formulario pueda manejarlo.
    throw error;
  }
};

/**
 * Restablece la contraseña usando un token y la nueva contraseña.
 * @param password - La nueva contraseña.
 * @param token - El token recibido en el enlace de recuperación.
 */
export const resetPassword = async (
  password: string,
  token: string
): Promise<any> => {
  try {
    // La ruta incluye el token como parámetro, ej: /auth/reset-password/xyz123
    const response = await apiClient.patch(`/auth/reset-password/${token}`, {
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error al restablecer la contraseña:", error);
    throw error;
  }
};
