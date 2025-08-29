import React from "react";
import { Card, CardHeader, CardBody } from "@heroui/react";
import RegisterForm from "../molecules/RegisterForm";
import type { RegisterFormProps } from "../../interfaces/Register";

const RegisterCard: React.FC<RegisterFormProps> = ({ onRegister }) => {
  return (
    <Card className="p-6 w-full max-w-sm shadow-lg">
      <CardHeader className="flex flex-col items-center text-center">
        <h2 className="text-2xl font-bold">Crear Cuenta</h2>
        <p className="text-sm text-gray-500">Regístrate para continuar</p>
      </CardHeader>
      <CardBody>
        <RegisterForm onRegister={onRegister} />
      </CardBody>
    </Card>
  );
};

export default RegisterCard;


