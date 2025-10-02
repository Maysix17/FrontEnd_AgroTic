import React from "react";
import CalendarOrganism from "../components/organisms/CalendarOrganism";

const GestionActividadesPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Actividades</h1>
      <CalendarOrganism />
    </div>
  );
};

export default GestionActividadesPage;
