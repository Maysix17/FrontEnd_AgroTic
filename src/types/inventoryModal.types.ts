/**
 * ===============================
 * INVENTARIO
 * ===============================
 */

/**
 * Representa un ítem de inventario
 */
export interface InventoryItem {
  id: string;
  nombre: string;
  descripcion?: string;
  stock: number;
  precio: number;
  capacidadUnidad?: number;
  fechaVencimiento?: string;
  imgUrl?: string;
  fkCategoriaId: string;
  fkBodegaId: string;
  categoria?: { id: string; nombre: string };
  bodega?: { id: string; nombre: string };
  stock_disponible?: number;
  stock_devuelto?: number;
  stock_sobrante?: number;
}

/**
 * Props del modal de detalles de inventario
 */
export interface InventoryDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
}

/**
 * Props del modal para crear/editar inventario
 */
export interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInventoryCreated: () => void;
  editItem?: InventoryItem | null;
}

/**
 * ===============================
 * COSECHA
 * ===============================
 */

export interface CreateCosechaDto {
  unidadMedida: string;
  cantidad: number;
  fecha: string;
  fkCultivosVariedadXZonaId: string;
}

export interface CosechaModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvzId: string;
  onSuccess: () => void;
}

/**
 * ===============================
 * ROLES Y PERMISOS
 * ===============================
 */

export interface Permiso {
  id: string;
  accion: string;
}

export interface Recurso {
  id: string;
  nombre: string;
  permisos: Permiso[];
}

export interface Modulo {
  id: string;
  nombre: string;
  recursos: Recurso[];
}

export interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoleCreated: () => void;
  editingRole?: any;
}

/**
 * ===============================
 * FICHAS
 * ===============================
 */

export interface FichaModalProps {
  isOpen: boolean;
  onClose: () => void;
  fichas: string[];
}

/**
 * ===============================
 * ACTIVIDADES
 * ===============================
 */

export interface Activity {
  id: string;
  descripcion: string;
  inventario_x_actividades?: {
    inventario: { nombre: string; id: string };
    cantidadUsada: number;
  }[];
}

export interface FinalizeActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: Activity | null;
  onSave: (data: FinalizeActivityData) => void;
}

export interface FinalizeActivityData {
  activityId?: string;
  returns: { [key: string]: number };
  surplus: { [key: string]: number };
  horas: number;
  precioHora: string;
  observacion: string;
  evidence: File | null;
}

/**
 * ===============================
 * CATEGORIAS Y BODEGAS (para inventario)
 * ===============================
 */

export interface Categoria {
  id: string;
  nombre: string;
}

export interface Bodega {
  id: string;
  nombre: string;
}
