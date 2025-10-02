import React, { useState } from "react";

interface SubItem {
  label: string;
  route: string;
}

interface MenuButtonWithSubmenuProps {
  icon: React.ElementType;
  label: string;
  subItems: SubItem[];
  navigate: (path: string) => void;
  parentRoute: string; // ruta del botón padre
}

const MenuButtonWithSubmenu: React.FC<MenuButtonWithSubmenuProps> = ({
  icon: IconComponent,
  label,
  subItems,
  navigate,
  parentRoute,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Botón padre */}
      <button
        className="flex flex-col items-center justify-center py-3 px-2 w-full rounded-xl
                   bg-white text-gray-600 shadow-sm hover:bg-gray-50"
        onClick={() => navigate(parentRoute)}
      >
        <IconComponent className="w-6 h-6 mb-1.5 text-gray-600" />
        <span className="text-sm font-semibold">{label}</span>
      </button>

      {/* Submenú */}
      {isOpen && (
        <div
          className="absolute left-full top-0 ml-2 bg-white shadow-lg rounded-xl w-48 z-50"
          onMouseEnter={() => setIsOpen(true)}  // mantiene abierto mientras el cursor esté aquí
          onMouseLeave={() => setIsOpen(false)} // cierra al salir
        >
          {subItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.route)}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuButtonWithSubmenu;

