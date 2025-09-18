import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuButton from "../molecules/MenuButton.tsx";
import {
  HomeIcon,
  DocumentTextIcon,
  SparklesIcon,
  CubeIcon,
  CpuChipIcon,
} from "@heroicons/react/24/outline";
import logo from "../../assets/AgroTic.png";
import logo2 from "../../assets/logoSena.png";
import type { MenuItem } from "../../types/Menu.types";
import { usePermission } from '../../contexts/PermissionContext';

const Menu: React.FC = () => {
  const { hasPermission, isAuthenticated } = usePermission();
  const navigate = useNavigate();

  const getRoute = (label: string) => {
    switch (label) {
      case "Inicio": return "/app";
      case "IOT": return "/app/iot";
      case "Cultivos": return "/app/cultivos";
      case "Fitosanitario": return "/app/fitosanitario";
      case "Inventario": return "/app/inventario";
      default: return "/app";
    }
  };

  const menuItems: MenuItem[] = [
    { label: "Inicio", icon: HomeIcon },
    { label: "IOT", icon: CpuChipIcon },
    { label: "Cultivos", icon: CubeIcon },
    { label: "Fitosanitario", icon: SparklesIcon },
    { label: "Inventario", icon: DocumentTextIcon },
  ];


  if (!isAuthenticated) return <div className="flex items-center justify-center h-screen">Loading permissions...</div>;

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
                   {menuItems.map((item) => {
            let hasPerm = false;
            switch (item.label) {
              case "Inicio":
                hasPerm = hasPermission("Inicio", "acceso_inicio", "ver");
                break;
              case "IOT":
                hasPerm = hasPermission("IOT", "acceso_iot", "ver");
                break;
              case "Cultivos":
                hasPerm = hasPermission("Cultivos", "acceso_cultivos", "ver");
                break;
              case "Fitosanitario":
                hasPerm = hasPermission("Fitosanitario", "acceso_fitosanitario", "ver");
                break;
              case "Inventario":
                hasPerm = hasPermission("Inventario", "acceso_inventario", "ver");
                break;
            }
            return hasPerm ? (
              <MenuButton
                key={item.label}
                icon={item.icon}
                label={item.label}
                onClick={() => navigate(getRoute(item.label))}
              />
            ) : null;
          })}
        </div>

        {/* Logo secundario */}
        <div className="flex flex-col items-center mt-6">
          <img src={logo2} alt="Logo secundario" className="w-28 h-auto" />
        </div>
      </div>

    </>
  );
};

export default Menu;
