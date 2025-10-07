export type Permission = {
  id: string;
  accion: string;
  // otros campos que tenga el permiso
};

export type Role = {
  id: string;
  nombre: string;
  permisos: Permission[];
};

export interface ManageRolesModalProps {
  isOpen: boolean;
  onClose: () => void;
}
