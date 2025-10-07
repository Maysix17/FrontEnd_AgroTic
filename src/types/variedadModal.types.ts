import type { VariedadData } from './variedad.types';

export interface VariedadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface VariedadModalState {
  variedades: VariedadData[];
  editData: VariedadData | null;
  message: string;
}
