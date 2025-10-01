import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/react';
import VariedadForm from '../molecules/VariedadForm';

interface VariedadModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: any;
  onSuccess?: () => void;
}

const VariedadModal: React.FC<VariedadModalProps> = ({ isOpen, onClose, editData, onSuccess }) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="md">
      <ModalContent className="bg-white p-6">
        <ModalHeader>
          <h2 className="text-xl font-semibold">
            {editData ? "Editar Variedad" : "Registrar Variedad"}
          </h2>
        </ModalHeader>
        <ModalBody>
          <VariedadForm editData={editData} onSuccess={onSuccess} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default VariedadModal;