import type { VariedadData } from './variedad.types';

export interface VariedadFormProps {
  editData?: VariedadData | null;
  onSuccess?: () => void;
}
