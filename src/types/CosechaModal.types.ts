/**
 * Props del modal de Cosecha
 */
export interface CosechaModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvzId: string;
  onSuccess: () => void;
}

/**
 * DTO para crear una Cosecha
 */
export interface CreateCosechaDto {
  unidadMedida: 'kg' | 'g' | 'l' | 'ml'; // puedes ampliar según tus unidades
  cantidad: number;
  fecha: string;
  fkCultivosVariedadXZonaId: string;
}
