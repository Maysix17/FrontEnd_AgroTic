

export interface ButtonProps {
  /** Texto que se mostrará en el botón */
  label?: string;

  /** Función que se ejecuta cuando se hace clic en el botón */
  onClick?: () => void;

  /** Si el botón está deshabilitado */
  disabled?: boolean;

  /** Color del botón (opcional, puede ser "primary", "secondary", etc.) */
  color?: string;

  /** Tipo de botón (submit, reset, button) */
  type?: "button" | "submit" | "reset";
}
