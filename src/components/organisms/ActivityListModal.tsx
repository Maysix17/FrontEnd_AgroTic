import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from '@heroui/react';

interface Activity {
  id: string;
  descripcion: string;
  categoriaActividad: { nombre: string };
}

interface ActivityListModalProps {
  isOpen: boolean;
  onClose: () => void;
  activities: Activity[];
  onSelectActivity: (activity: Activity) => void;
  onRegisterNew: () => void;
}

const ActivityListModal: React.FC<ActivityListModalProps> = ({ isOpen, onClose, activities, onSelectActivity, onRegisterNew }) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="md">
      <ModalContent>
        <ModalHeader>
          <h2 className="text-xl font-semibold">Actividades del día</h2>
          <Button onClick={onRegisterNew}>Registrar Nueva</Button>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-2">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => onSelectActivity(activity)}
                >
                  <div className="font-medium">{activity.categoriaActividad.nombre}</div>
                  <div className="text-sm text-gray-600">{activity.descripcion}</div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No hay actividades para este día.</p>
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ActivityListModal;