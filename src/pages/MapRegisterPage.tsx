import React, { useState } from "react";
import MapModal from "../components/organisms/MapModal";
import PrimaryButton from "../components/atoms/PrimaryButton";

const MapRegisterPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Botón para abrir modal */}
      <PrimaryButton text="Abrir Modal Mapa" onClick={() => setIsOpen(true)} />

      {/* Modal con formulario */}
      <MapModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default MapRegisterPage;

