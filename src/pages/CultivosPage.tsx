import React from "react";
import InputSearch from "../components/atoms/buscador";
import CustomButton from "../components/atoms/Boton"; // tu botón
import { useNavigate } from "react-router-dom";

const CultivosPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6">
      {/* fila con buscador a la izquierda y botones a la derecha */}
      <div className="flex justify-between items-center">
        {/* buscador más pequeño */}
        <div className="w-1/3">
          <InputSearch
            placeholder="Buscar cultivos..."
            value=""
            onChange={() => { }}
          />
        </div>

        {/* botones alineados a la derecha */}
        <div className="flex gap-4">
          <CustomButton
            label="Registrar Tipo de Cultivo"
            onClick={() => navigate("tipo-cultivo")}
          />
          <CustomButton
            label="Registrar Variedad"
            onClick={() => navigate("variedad")}
          />
        </div>
      </div>
    </div>
  );
};

export default CultivosPage;