import type { ButtonProps } from "./Boton.type";

export type CardField = {
  label: string;
  value: string | number | React.ReactNode;
};

// Compatible con CustomButton
export type CardAction = {
  label: string;
  onClick: () => void;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
};

export type MobileCardProps = {
  fields: CardField[];
  actions?: CardAction[];
  className?: string;
};
