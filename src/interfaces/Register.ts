export interface RegisterFormProps {
  onRegister?: (data: {
    nombres: string;
    apellidos: string;
    dni: string;
    telefono: string;
    password: string;
  }) => void;
}
