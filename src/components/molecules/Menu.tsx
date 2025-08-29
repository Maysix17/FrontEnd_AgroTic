import React from 'react';
import Icon from '../atoms/Icons.tsx';

type MenuButtonProps = {
    icon: React.ElementType<React.SVGProps<SVGSVGElement>>;
    label: string;
    active?: boolean;
    onClick?: () => void;
};

const MenuButton: React.FC<MenuButtonProps> = ({ icon, label, active = false, onClick }) => {
    return (
        <button
            className={`
        flex flex-col items-center justify-center py-3 px-2 w-full rounded-xl {/* Cambiado de py-3.5 a py-3 */}
        transition-all duration-150 ease-in-out select-none
        ${active
                    ? 'bg-gray-200 text-gray-900 shadow-md' // Estilo activo: fondo gris claro, texto/icono oscuro, sombra
                    : 'bg-white text-gray-600 shadow-sm hover:bg-gray-50' // Estilo inactivo: fondo blanco, texto/icono más claro, sombra sutil, hover
                }
        focus:outline-none
    `}
            onClick={onClick}
        >
            <Icon icon={icon} className={`w-6 h-6 mb-1.5 ${active ? 'text-gray-900' : 'text-gray-600'}`} />
            <span className={`text-sm font-semibold ${active ? 'text-gray-900' : 'text-gray-600'}`}>{label}</span>
        </button>
    );
};

export default MenuButton;