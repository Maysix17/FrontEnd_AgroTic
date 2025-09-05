import React, { useState } from "react";
import MenuButton from "../molecules/Menu.tsx";
import {
  HomeIcon,
  DocumentTextIcon,
  SparklesIcon,
  CubeIcon,
  CpuChipIcon,
} from "@heroicons/react/24/outline";
import logo from "../../assets/AgroTic.png";
import logo2 from "../../assets/logoSena.png";
import MapModal from "../organisms/MapModal";
import type { MenuItem } from "../../interfaces/MenuIten.ts"; 
import FitosanitarioButtons from "../molecules/Botons.tsx"; 

const Menu: React.FC = () => {
  const [activeItem, setActiveItem] = useState("");
  const [isCultivosOpen, setIsCultivosOpen] = useState(false);
  const [showFitosanitario, setShowFitosanitario] = useState(false); 

  const menuItems: MenuItem[] = [
    { label: "Inicio", icon: HomeIcon },
    { label: "IOT", icon: CpuChipIcon },
    { label: "Cultivos", icon: CubeIcon },
    { label: "Fitosanitario", icon: SparklesIcon },
    { label: "Inventario", icon: DocumentTextIcon },
  ];

  const handleClick = (label: string) => {
    setActiveItem(label);

    if (label === "Cultivos") {
      setIsCultivosOpen(true);
    }

    if (label === "Fitosanitario") {
      setShowFitosanitario(!showFitosanitario); // alterna mostrar la molecule
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-screen w-56 bg-gray-50 p-4 flex flex-col justify-between rounded-tr-3xl rounded-br-3xl shadow-xl">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Logo tic" className="w-40 h-auto mb-2" />
        </div>

        {/* Botones del menú */}
        <div className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <MenuButton
              key={item.label}
              icon={item.icon}
              label={item.label}
              active={activeItem === item.label}
              onClick={() => handleClick(item.label)}
            />
          ))}
        </div>

        {/* Logo secundario */}
        <div className="flex flex-col items-center mt-6">
          <img src={logo2} alt="Logo secundario" className="w-28 h-auto" />
        </div>
      </div>

      {/* Modal de cultivos */}
      <MapModal
        isOpen={isCultivosOpen}
        onClose={() => setIsCultivosOpen(false)}
      />

      {/* Molecule de Fitosanitario */}
      {showFitosanitario && (
        <div className="ml-60 p-8">
          <FitosanitarioButtons />
        </div>
      )}
    </>
  );
};

export default Menu;
