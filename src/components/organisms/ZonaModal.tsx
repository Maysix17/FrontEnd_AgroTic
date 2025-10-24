import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@heroui/react";

import ZonaForm from "../molecules/ZonaForm";

interface ZonaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const ZonaModal: React.FC<ZonaModalProps> = ({ isOpen, onClose, onSave }) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} placement="center" size="5xl">
      <ModalContent>
        {() => (
          <>
            <ModalHeader>
              <h2 className="text-lg font-bold">Registrar Nueva Zona</h2>
            </ModalHeader>

            <ModalBody>
              <ZonaForm onClose={onClose} onSave={onSave} />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ZonaModal;