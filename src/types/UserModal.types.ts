/**
 * Props del componente UserModal
 */
export interface UserModalProps {
  /** Indica si el modal está abierto */
  isOpen: boolean;
  /** Función para cerrar el modal */
  onClose: () => void;
}

/**
 * Interfaz para el rol del usuario
 */
export interface Role {
  id: string;
  nombre: string;
}

/**
 * Interfaz para la ficha del usuario
 */
export interface Ficha {
  id: string;
  numero: number;
}

/**
 * Interfaz para los datos del usuario
 */
export interface User {
  id: string;
  nombres: string;
  apellidos: string;
  dni: string;
  correo: string;
  telefono: string;
  rol: Role;
  ficha?: Ficha;
}
