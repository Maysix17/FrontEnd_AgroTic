import React from "react";
import InputSearch from "../components/atoms/buscador";
import CustomButton from "../components/atoms/Boton"; // tu botón
import { useNavigate } from "react-router-dom";

const CultivosPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6">
      {/* fila con buscador a la izquierda y botón a la derecha */}
      <div className="flex justify-between items-center">
        {/* buscador más pequeño */}
        <div className="w-1/3">
          <InputSearch
            placeholder="Buscar cultivos..."
            value=""
            onChange={() => {}}
          />
        </div>

        {/* botón alineado a la derecha */}
        <CustomButton
          label="Registrar Tipo de Cultivo"
          onClick={() => navigate("/cultivos/tipo-cultivo")}
        />
      </div>
    </div>
  );
};

export default CultivosPage;