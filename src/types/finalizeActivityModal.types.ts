/**
 * Representa un inventario asociado a una actividad
 */
export interface InventarioActividad {
  inventario: {
    id: string;
    nombre: string;
  };
  cantidadUsada: number;
}

/**
 * Representa una actividad
 */
export interface Activity {
  id: string;
  descripcion: string;
  inventario_x_actividades?: InventarioActividad[];
}

/**
 * Datos que se envían al finalizar la actividad
 */
export interface FinalizeActivityData {
  activityId?: string;
  returns: Record<string, number>;
  surplus: Record<string, number>;
  horas: number;
  precioHora: string;
  observacion: string;
  evidence: File | null;
}

/**
 * Props del modal para finalizar actividad
 */
export interface FinalizeActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: Activity | null;
  onSave: (data: FinalizeActivityData) => void;
}
