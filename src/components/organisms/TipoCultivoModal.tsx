import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/react';
import TipoCultivoForm from '../molecules/CultivoForm';

interface TipoCultivoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TipoCultivoModal: React.FC<TipoCultivoModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="md">
      <ModalContent className="bg-white p-6">
        <ModalHeader>
          <h2 className="text-xl font-semibold">Registrar Tipo de Cultivo</h2>
        </ModalHeader>
        <ModalBody>
          <TipoCultivoForm />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TipoCultivoModal;