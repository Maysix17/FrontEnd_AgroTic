// Representa un usuario asignado a una actividad
export interface UsuarioActividad {
  usuario: {
    numero_documento: number;
    nombres: string;
    apellidos: string;
  };
}

// Representa un inventario/material utilizado en una actividad
export interface InventarioActividad {
  inventario: {
    nombre: string;
  };
  cantidadUsada: number;
}

// Representa el cultivo dentro de una relación cultivo x variedad
export interface CultivoXVariedad {
  cultivo: {
    nombre: string;
  };
}

// Representa la relación de cultivo, variedad y zona
export interface CultivoVariedadZona {
  zona: {
    nombre: string;
  };
  cultivoXVariedad: CultivoXVariedad;
}

// Representa la categoría de una actividad (ej: Siembra, Cosecha)
export interface CategoriaActividad {
  nombre: string;
}

// Representa una actividad completa
export interface Activity {
  id: string;
  descripcion: string;
  categoriaActividad: CategoriaActividad;
  cultivoVariedadZona: CultivoVariedadZona;
  usuarios_x_actividades?: UsuarioActividad[];
  inventario_x_actividades?: InventarioActividad[];
}

// Props del modal de detalle de actividad
export interface ActivityDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: Activity | null;
  onUpdate: (id: string, data: any) => void;
  onDelete: (id: string) => void;
  onFinalize: (activity: Activity) => void;
}

// Props del modal de lista de actividades
export interface ActivityListModalProps {
  isOpen: boolean;
  onClose: () => void;
  activities: Activity[];
  onSelectActivity: (activity: Activity) => void;
  onRegisterNew: () => void;
}
