import React from "react";
import { Button } from "@heroui/react";
import type { ButtonProps } from "../../types/Boton.type";

interface IconButtonProps extends Omit<ButtonProps, 'label' | 'text'> {
  icon: React.ReactNode;
  tooltip?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  tooltip,
  onClick,
  disabled = false,
  color = "primary",
  variant = "light",
  size = "sm",
  className = "",
  ariaLabel,
  ...props
}) => {
  const button = (
    <Button
      color={color as any}
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={onClick}
      className={`w-9 h-9 min-w-9 p-0 flex items-center justify-center ${className}`}
      aria-label={ariaLabel || tooltip}
      {...props}
    >
      {icon}
    </Button>
  );

  if (tooltip) {
    return (
      <div className="relative group">
        {button}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-tooltip whitespace-nowrap">
          {tooltip}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
        </div>
      </div>
    );
  }

  return button;
};

export default IconButton;