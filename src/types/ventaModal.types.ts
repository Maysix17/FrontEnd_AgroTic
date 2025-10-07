import type { Cultivo } from './cultivos.types';
import type { CreateVentaDto } from './venta.types';

/** Props del componente VentaModal */
export interface VentaModalProps {
  /** Indica si el modal está abierto */
  isOpen: boolean;
  /** Función para cerrar el modal */
  onClose: () => void;
  /** Cultivo seleccionado, puede ser null */
  cultivo: Cultivo | null;
  /** Función que se ejecuta al registrar la venta exitosamente */
  onSuccess: () => void;
}

/** Estado del formulario de venta */
export interface VentaFormData extends CreateVentaDto {
  fkCosechaId: string;
}
