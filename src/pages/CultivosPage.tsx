import React, { useState } from "react";
import InputSearch from "../components/atoms/buscador";
import CustomButton from "../components/atoms/Boton"; // tu botón
import TipoCultivoModal from "../components/organisms/TipoCultivoModal";
import VariedadModal from "../components/organisms/VariedadModal";

const CultivosPage: React.FC = () => {
  const [isTipoCultivoModalOpen, setIsTipoCultivoModalOpen] = useState(false);
  const [isVariedadModalOpen, setIsVariedadModalOpen] = useState(false);

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
            onClick={() => setIsTipoCultivoModalOpen(true)}
          />
          <CustomButton
            label="Registrar Variedad"
            onClick={() => setIsVariedadModalOpen(true)}
          />
        </div>
      </div>

      <TipoCultivoModal
        isOpen={isTipoCultivoModalOpen}
        onClose={() => setIsTipoCultivoModalOpen(false)}
      />

      <VariedadModal
        isOpen={isVariedadModalOpen}
        onClose={() => setIsVariedadModalOpen(false)}
      />
    </div>
  );
};

export default CultivosPage;