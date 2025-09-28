import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@heroui/react";
import { usePermission } from "../../contexts/PermissionContext";
import { useNavigate } from "react-router-dom";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose }) => {
  const { user, logout } = usePermission();
  const navigate = useNavigate();

  console.log('UserModal isOpen:', isOpen);

  const handleLogout = async () => {
    console.log('Logging out user');
    await logout();
    console.log('Navigating to /login');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} placement="center">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="relative">
              <h2 className="text-lg font-bold">User Profile</h2>
              <Button
                onClick={handleLogout}
                className="absolute top-2 right-2 bg-red-500 text-white"
                size="sm"
              >
                Logout
              </Button>
            </ModalHeader>

            <ModalBody>
              <p><strong>Name:</strong> {user.nombres} {user.apellidos}</p>
              <p><strong>Email:</strong> {user.correo}</p>
              <p><strong>Role:</strong> {user.rol.nombre}</p>
              <p><strong>DNI:</strong> {user.dni}</p>
              <p><strong>Phone:</strong> {user.telefono}</p>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default UserModal;