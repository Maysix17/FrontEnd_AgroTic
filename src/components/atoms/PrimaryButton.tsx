import React from "react";
import { Button } from "@heroui/react";
import type { PrimaryButtonProps } from "../../types/primaryButton.types";

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  text,
  type = "button",
  onClick,
  disabled = false,
  color = "success",
  variant = "solid",
  className = "",
}) => {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled}
      color={color}
      variant={variant}
      className={`rounded-xl ${className}`}
    >
      {text}
    </Button>
  );
};

export default PrimaryButton;

