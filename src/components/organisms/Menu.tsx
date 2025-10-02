import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MenuButton from "../molecules/MenuButton";
import UserModal from "./UserModal";
import {
  HomeIcon,
  DocumentTextIcon,
  CubeIcon,
  CpuChipIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import logo from "../../assets/AgroTic.png";
import logo2 from "../../assets/logoSena.png";
import { usePermission } from '../../contexts/PermissionContext';

const Menu: React.FC = () => {
  // 2. Obtener datos y funciones del contexto de permisos/autenticación
  const { permissions, isAuthenticated, hasPermission, user } = usePermission();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserCardModalOpen, setIsUserCardModalOpen] = useState(false);

  // Módulos principales estáticos
  const mainModules = [
    { nombre: 'Inicio' },
    { nombre: 'IOT' },
    { nombre: 'Cultivos' },
    { nombre: 'Inventario' },
    { nombre: 'Usuarios' },
  ];

  const getIcon = (label: string) => {
    switch (label) {
      case "Inicio": return HomeIcon;
      case "IOT": return CpuChipIcon;
      case "Cultivos": return CubeIcon;
      case "Inventario": return DocumentTextIcon;
      case "Usuarios": return UserIcon;
      default: return HomeIcon;
    }
  };

  const getRoute = (label: string) => {
    switch (label) {
      case "Inicio": return "/app";
      case "IOT": return "/app/iot";
      case "Cultivos": return "/app/cultivos";
      case "Inventario": return "/app/inventario";
      case "Zapato": return "/app/zapato";
      default: return "/app";
    }
  };


  const filteredModules = mainModules.filter(module =>
    permissions.some(perm => perm.modulo === module.nombre && perm.accion === 'ver') ||
    module.nombre === 'Usuarios'
  );

  const priorityOrder = ['Inicio', 'IOT', 'Cultivos', 'Inventario', 'Usuarios'];
  const sortedFilteredModules = [...filteredModules].sort((a, b) => {
    const aIndex = priorityOrder.indexOf(a.nombre);
    const bIndex = priorityOrder.indexOf(b.nombre);
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return 0;
  });

  if (!isAuthenticated) {
    return <div className="flex items-center justify-center h-screen">Cargando permisos...</div>;
  }

  return (
    <div className="fixed left-0 top-0 h-screen w-56 bg-gray-50 p-4 flex flex-col justify-between rounded-tr-3xl rounded-br-3xl shadow-xl">
      <div>
        {/* Logo y Botón de Usuario */}
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Logo tic" className="w-40 h-auto mb-6" />
          {/* 3. Implementar el UserButton */}
          
        </div>

        {/* Botones del menú */}
        <div className="flex flex-col gap-2">
          {sortedFilteredModules.map((module) => {
            const IconComponent = getIcon(module.nombre);
            const label = module.nombre === 'Usuarios' ? 'Perfil' : module.nombre;
            const onClickHandler = module.nombre === 'Usuarios' ? () => setIsUserCardModalOpen(true) : () => navigate(getRoute(module.nombre));
            return (
              <MenuButton
                key={module.nombre}
                icon={IconComponent}
                label={label}
                onClick={onClickHandler}
              />
            );
          })}
          {/* Botón de Zapato sin permisos */}
        {/* <MenuButton
            key="Zapato"
            icon={DocumentTextIcon}
            label="Zapato"
            onClick={() => navigate(getRoute("Zapato"))}
          />*/}
        </div>

      </div>

      {/* Logo secundario */}
      <div className="flex flex-col items-center mt-6">
        <img src={logo2} alt="Logo secundario" className="w-28 h-auto" />
      </div>

      <UserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <UserModal isOpen={isUserCardModalOpen} onClose={() => setIsUserCardModalOpen(false)} />
    </div>


  );
};

export default Menu;
