import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MenuButton from "../molecules/MenuButton";
import MenuButtonWithSubmenu from "../molecules/MenuButtonWithSubmenu";
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
import { usePermission } from "../../contexts/PermissionContext";
import { getModules } from "../../services/moduleService";
import type { Modulo } from "../../types/module";

const Menu: React.FC = () => {
  const { permissions, isAuthenticated } = usePermission();
  const navigate = useNavigate();
  const [modules, setModules] = useState<Modulo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserCardModalOpen, setIsUserCardModalOpen] = useState(false);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const fetchedModules = await getModules();
        setModules(fetchedModules);
      } catch (error) {
        console.error("Error fetching modules:", error);
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated) fetchModules();
  }, [isAuthenticated]);

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
      default: return "/app";
    }
  };

  const filteredModules = modules.filter(
    module =>
      permissions.some(perm => perm.modulo === module.nombre && perm.accion === "ver") ||
      module.nombre === "Usuarios"
  );

  const priorityOrder = ["Inicio", "IOT", "Cultivos", "Inventario", "Usuarios"];
  const sortedFilteredModules = [...filteredModules].sort((a, b) => {
    const aIndex = priorityOrder.indexOf(a.nombre);
    const bIndex = priorityOrder.indexOf(b.nombre);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return 0;
  });

  if (!isAuthenticated || loading) {
    return <div className="flex items-center justify-center h-screen">Cargando permisos...</div>;
  }

  return (
    <div className="fixed left-0 top-0 h-screen w-56 bg-gray-50 p-4 flex flex-col justify-between rounded-tr-3xl rounded-br-3xl shadow-xl">
      <div>
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Logo tic" className="w-40 h-auto mb-6" />
        </div>

        {/* Botones del menú */}
        <div className="flex flex-col gap-2">
          {sortedFilteredModules.map((module) => {
            const IconComponent = getIcon(module.nombre);
            const label = module.nombre === "Usuarios" ? "Perfil" : module.nombre;

            // Caso especial: Cultivos -> padre normal, submenú solo "Gestión de Actividades"
            if (module.nombre === "Cultivos") {
              return (
              <MenuButtonWithSubmenu
              key={module.id}
              icon={CubeIcon}
              label="Cultivos"
              parentRoute="/app/cultivos" // ruta del botón padre
              subItems={[
                {
                  label: "Gestión de Actividades",
                  route: "/app/cultivos/gestion-actividades",
                },
              ]}
              navigate={navigate}
              />
            );
          }
            // Resto de botones
            const onClickHandler =
              module.nombre === "Usuarios"
                ? () => setIsUserCardModalOpen(true)
                : () => navigate(getRoute(module.nombre));

            return (
              <MenuButton
                key={module.id}
                icon={IconComponent}
                label={label}
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
      <UserModal
        isOpen={isUserCardModalOpen}
        onClose={() => setIsUserCardModalOpen(false)}
      />
    </div>
  );
};

export default Menu;

