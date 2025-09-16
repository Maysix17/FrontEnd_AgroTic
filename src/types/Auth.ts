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
