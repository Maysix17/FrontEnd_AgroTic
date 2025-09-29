import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MenuButton from "../molecules/MenuButton";
import UserModal from "./UserModal";
import {
  HomeIcon,
  DocumentTextIcon,
  SparklesIcon,
  CubeIcon,
  CpuChipIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import logo from "../../assets/AgroTic.png";
import logo2 from "../../assets/logoSena.png";
import type { MenuItem } from "../../types/Menu.types";
import { usePermission } from '../../contexts/PermissionContext';
import { getModules } from '../../services/moduleService';
import type { Modulo } from '../../types/module';

const Menu: React.FC = () => {
  // 2. Obtener datos y funciones del contexto de permisos/autenticación
  const { user, permissions, hasPermission, isAuthenticated, logout } = usePermission();
  const navigate = useNavigate();
  const [modules, setModules] = useState<Modulo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const fetchedModules = await getModules();
        setModules(fetchedModules);
      } catch (error) {
        console.error('Error fetching modules:', error);
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated) {
      fetchModules();
    }
  }, [isAuthenticated]);

  const getIcon = (label: string) => {
    switch (label) {
      case "Inicio": return HomeIcon;
      case "IOT": return CpuChipIcon;
      case "Cultivos": return CubeIcon;
      case "Fitosanitario": return SparklesIcon;
      case "Inventario": return DocumentTextIcon;
      default: return HomeIcon;
    }
  };

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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const filteredModules = modules.filter(module =>
    permissions.some(perm => perm.modulo === module.nombre && perm.accion === 'ver') &&
    module.nombre !== 'usuarios'
  );

  const priorityOrder = ['Inicio', 'IOT', 'Cultivos', 'Inventario'];
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

  console.log('Filtered modules count:', filteredModules.length);
  console.log('Filtered modules:', filteredModules.map(m => m.nombre));

  if (!isAuthenticated || loading) {
    return <div className="flex items-center justify-center h-screen">Cargando permisos...</div>;
  }

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gray-50 p-4 flex flex-col justify-between rounded-tr-3xl rounded-br-3xl shadow-xl">
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
            return (
              <MenuButton
                key={module.id}
                icon={IconComponent}
                label={module.nombre}
                onClick={() => navigate(getRoute(module.nombre))}
              />
            );
          })}
        </div>

        {/* Botón de Perfil */}
        <div className="flex flex-col gap-2 mt-4">
          <MenuButton
            icon={UserIcon}
            label="Perfil"
            onClick={() => setIsModalOpen(true)}
          />
        </div>
      </div>

      {/* Logo secundario */}
      <div className="flex flex-col items-center mt-6">
        <img src={logo2} alt="Logo secundario" className="w-28 h-auto" />
      </div>

      <UserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>


  );
};

export default Menu;
