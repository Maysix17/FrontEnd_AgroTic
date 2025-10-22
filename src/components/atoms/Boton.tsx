import { Button } from "@heroui/react";
import type { ButtonProps } from "../../types/Boton.type";

const CustomButton: React.FC<ButtonProps> = ({
    label,
    text,
    children,
    onClick,
    disabled = false,
    color = "primary",
    variant = "solid",
    type = "button",
    className = "",
    ariaLabel,
    size = "md"
}) => {
    // Determine the button content
    const buttonContent = label || text || children;

    // Base styles for all variants
    const baseClass = `
        font-semibold
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-95
    `;

    // Size-specific styles
    const sizeStyles = {
        sm: "px-3 py-2 text-sm rounded-md",
        md: "px-4 py-2 text-base rounded-lg",
        lg: "px-6 py-3 text-lg rounded-xl"
    };

    // Variant-specific styles
    const variantStyles: Record<string, Record<string, string>> = {
        solid: {
            primary: "bg-primary-500 hover:bg-primary-600 text-white shadow-md hover:shadow-lg focus:ring-primary-500",
            secondary: "bg-white hover:bg-gray-50 text-muted-600 border border-gray-300 shadow-sm hover:shadow-md focus:ring-primary-500",
            danger: "bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg focus:ring-red-500",
            ghost: "bg-transparent hover:bg-gray-100 text-muted-600 focus:ring-primary-500"
        },
        bordered: {
            primary: "border border-primary-500 text-primary-600 hover:bg-primary-50 focus:ring-primary-500",
            secondary: "border border-gray-300 text-muted-600 hover:bg-gray-50 focus:ring-primary-500",
            danger: "border border-red-500 text-red-600 hover:bg-red-50 focus:ring-red-500",
            ghost: "border border-transparent text-muted-600 hover:bg-gray-100 focus:ring-primary-500"
        },
        light: {
            primary: "bg-primary-100 hover:bg-primary-200 text-primary-700 focus:ring-primary-500",
            secondary: "bg-gray-100 hover:bg-gray-200 text-muted-700 focus:ring-primary-500",
            danger: "bg-red-100 hover:bg-red-200 text-red-700 focus:ring-red-500",
            ghost: "bg-transparent hover:bg-gray-100 text-muted-600 focus:ring-primary-500"
        }
    };

    const currentVariantStyles = variantStyles[variant] || variantStyles.solid;
    const currentColorStyles = currentVariantStyles[color] || currentVariantStyles.primary;

    return (
        <Button
            color={color as any}
            variant={variant}
            size={size}
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`${baseClass} ${sizeStyles[size]} ${currentColorStyles} ${className}`}
            aria-label={ariaLabel}
        >
            <span className="flex items-center justify-center gap-2">
                {buttonContent}
            </span>
        </Button>
    );
};

export default CustomButton;
