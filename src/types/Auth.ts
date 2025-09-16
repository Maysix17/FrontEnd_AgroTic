export interface RegisterPayload {
  dni: number;
  nombres: string;
  apellidos: string;
  correo: string;
  password: string;
  telefono: number;
}

export interface RegisterFormData {
  nombres: string;
  apellidos: string;
  dni: string;
  telefono: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  dni: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  access_token: string;
  refresh_token: string;
}
