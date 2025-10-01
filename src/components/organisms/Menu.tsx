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
  const { isAuthenticated, hasPermission } = usePermission();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserCardModalOpen, setIsUserCardModalOpen] = useState(false);

  const menuItems = [
    { label: 'Inicio', icon: HomeIcon, route: '/app', resource: 'acceso_inicio' },
    { label: 'IOT', icon: CpuChipIcon, route: '/app/iot', resource: 'acceso_iot' },
    { label: 'Cultivos', icon: CubeIcon, route: '/app/cultivos', resource: 'acceso_cultivos' },
    { label: 'Inventario', icon: DocumentTextIcon, route: '/app/inventario', resource: 'acceso_inventario' },
    { label: 'Perfil', icon: UserIcon, route: null, resource: 'acceso_perfil' },
  ];

  const filteredMenuItems = menuItems.filter(item =>
    hasPermission(item.resource, 'ver')
  );

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
          {filteredMenuItems.map((item) => {
            const IconComponent = item.icon;
            const onClickHandler = item.label === 'Perfil' ? () => setIsUserCardModalOpen(true) : () => navigate(item.route!);
            return (
              <MenuButton
                key={item.label}
                icon={IconComponent}
                label={item.label}
                onClick={onClickHandler}
              />
            );
          })}
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
