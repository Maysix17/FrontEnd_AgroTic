import React, { useState } from 'react';
import ButtonAccion from '../components/atoms/ButtonAccion';
import InventoryModal from '../components/organisms/InventoryModal';

const InventoryPage: React.FC = () => {
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Inventario</h1>
        <div className="space-x-2">
          <ButtonAccion onClick={() => setIsInventoryModalOpen(true)}>Registrar Inventario</ButtonAccion>
        </div>
      </div>

      {/* Placeholder for future content */}
      <p>Próximamente: búsqueda y listado de inventarios.</p>

      <InventoryModal
        isOpen={isInventoryModalOpen}
        onClose={() => setIsInventoryModalOpen(false)}
        onInventoryCreated={() => {
          // Optionally refresh the list or show a message
        }}
      />
    </div>
  );
};

export default InventoryPage;