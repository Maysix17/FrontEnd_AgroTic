import React from 'react';
import { Modal, ModalContent, Button } from '@heroui/react';
import CustomButton from '../atoms/Boton';
import type { InventoryItem } from '../../services/inventoryService';

interface InventoryDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
}

const InventoryDetailsModal: React.FC<InventoryDetailsModalProps> = ({ isOpen, onClose, item, onEdit, onDelete }) => {
  if (!item) return null;

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="2xl">
      <ModalContent className="bg-white p-6 relative">
        {/* Edit and Delete buttons in top right */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <CustomButton
            text="Editar"
            onClick={() => onEdit(item)}
            className="bg-blue-500 hover:bg-blue-600"
          />
          <Button
            onClick={() => onDelete(item.id)}
            color="danger"
            variant="solid"
          >
            Eliminar
          </Button>
        </div>

        <h2 className="text-2xl font-bold mb-4">Detalles del Inventario</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <p className="mt-1 text-gray-900">{item.nombre}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Stock</label>
              <p className="mt-1 text-gray-900">{item.stock}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Precio</label>
              <p className="mt-1 text-gray-900">${item.precio}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Capacidad Unidad</label>
              <p className="mt-1 text-gray-900">{item.capacidadUnidad || '-'}</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <p className="mt-1 text-gray-900">{item.descripcion || '-'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha de Vencimiento</label>
            <p className="mt-1 text-gray-900">{item.fechaVencimiento || '-'}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Categoría</label>
              <p className="mt-1 text-gray-900">{item.categoria?.nombre || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bodega</label>
              <p className="mt-1 text-gray-900">{item.bodega?.nombre || '-'}</p>
            </div>
          </div>
          {item.imgUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Imagen</label>
              <img
                src={`http://localhost:3000/uploads/${item.imgUrl}`}
                alt={item.nombre}
                className="mt-1 w-32 h-32 object-cover rounded-lg"
              />
            </div>
          )}
        </div>
        <div className="flex justify-end mt-6">
          <Button onClick={onClose} variant="light">Cerrar</Button>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default InventoryDetailsModal;