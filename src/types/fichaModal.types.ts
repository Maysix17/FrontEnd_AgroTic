/**
 * Props para el modal de fichas
 */
export interface FichaModalProps {
  isOpen: boolean;
  onClose: () => void;
  fichas: string[];
}
