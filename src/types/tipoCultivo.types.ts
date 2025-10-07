/**
 * Datos de un tipo de cultivo
 */
export interface TipoCultivoData {
  /** ID opcional del cultivo */
  id?: string;

  /** Nombre del cultivo */
  nombre: string;
}

/**
 * Respuesta genérica de la API
 */
export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * Props del componente TipoCultivoModal
 */
export interface TipoCultivoModalProps {
  /** Indica si el modal está abierto */
  isOpen: boolean;

  /** Función para cerrar el modal */
  onClose: () => void;
}

/**
 * Mensajes que puede mostrar el modal
 */
export type TipoCultivoModalMessage = string;

/**
 * Función para manejar la edición de un tipo de cultivo
 */
export type HandleEdit = (cultivo: TipoCultivoData) => void;

/**
 * Función para manejar la eliminación de un tipo de cultivo
 */
export type HandleDelete = (id: string) => void;
