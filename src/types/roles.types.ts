/**
 * Representa un permiso de un recurso
 */
export interface Permiso {
  id: string;
  accion: string;
}

/**
 * Representa un recurso dentro de un módulo
 */
export interface Recurso {
  id: string;
  nombre: string;
  permisos: Permiso[];
}

/**
 * Representa un módulo principal
 */
export interface Modulo {
  id: string;
  nombre: string;
  recursos: Recurso[];
}

/**
 * Props para el modal de creación/edición de roles
 */
export interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoleCreated: () => void;
  editingRole?: Role | null;
}

/**
 * Representa un rol con permisos
 */
export interface Role {
  id: string;
  nombre: string;
  permisos: PermisoWithRecurso[];
}

/**
 * Permiso extendido con información del recurso y módulo
 */
export interface PermisoWithRecurso extends Permiso {
  recurso: {
    id: string;
    nombre: string;
    modulo: {
      id: string;
      nombre: string;
    };
  };
}
