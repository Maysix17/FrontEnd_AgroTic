export interface Usuario {
  id: string;
  dni: number;
  nombres: string;
  apellidos: string;
}

export interface Material {
  id: string;
  nombre: string;
  categoria: string;
  stock: number;
  stock_disponible?: number;
  stock_devuelto?: number;
  stock_sobrante?: number;
}

export interface Categoria {
  id: string;
  nombre: string;
}

export interface Zona {
  id: string;
  nombre: string;
}

export interface ActividadModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onSave: (data: any) => void;
}
