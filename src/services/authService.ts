import apiClient from "../lib/axios/axios";
import type { RegisterPayload, RegisterFormData } from "../types/Auth";

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
