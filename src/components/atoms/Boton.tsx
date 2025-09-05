import { Button } from "@heroui/react";
import type { ButtonProps } from "../../types/Boton.type";

const CustomButton: React.FC<ButtonProps> = ({ label, onClick }) => {
    return (
        <Button
            className="rounded-2xl px-4 py-2 shadow-md text-white"
            style={{ backgroundColor: "#34A853" }}
            onClick={onClick}
        >
            {label}
        </Button>
    );
};

export default CustomButton;
