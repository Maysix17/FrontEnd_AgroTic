// src/types/MapModal.ts

/**
 * Props para el componente MapModal.
 */
export interface MapModalProps {
  /** Indica si el modal está abierto */
  isOpen: boolean;

  /** Función para cerrar el modal */
  onClose: () => void;
}
