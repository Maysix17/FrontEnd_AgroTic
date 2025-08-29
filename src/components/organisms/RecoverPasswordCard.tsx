import React from "react";
import { Card, CardHeader, CardBody } from "@heroui/react";
import RecoverPasswordForm from "../molecules/RecoverPasswordForm";

const RecoverPasswordCard: React.FC = () => {
  return (
    <Card className="p-6 w-full max-w-sm shadow-lg">
      <CardHeader className="flex flex-col items-center text-center">
        <h2 className="text-2xl font-bold">Recuperar Contraseña</h2>
        <p className="text-sm text-gray-500">
          El correo al que le llegará la verificación es el mismo de su registro
        </p>
      </CardHeader>
      <CardBody>
        {/* 👇 ya no recibe props */}
        <RecoverPasswordForm />
      </CardBody>
    </Card>
  );
};

export default RecoverPasswordCard;


