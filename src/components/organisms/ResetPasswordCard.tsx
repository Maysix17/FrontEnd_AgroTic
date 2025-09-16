import React from "react";
import { Card, CardHeader, CardBody } from "@heroui/react";
import ResetPasswordForm from "../molecules/ResetPasswordForm";

interface ResetPasswordCardProps {
  token?: string;
}

const ResetPasswordCard: React.FC<ResetPasswordCardProps> = ({ token }) => {
  return (
    <Card className="p-6 w-full max-w-sm shadow-lg">
      <CardHeader className="flex flex-col items-center text-center">
        <h2 className="text-2xl font-bold">Restablecer Contraseña</h2>
        <p className="text-sm text-gray-500">
          Ingresa tu nueva contraseña. Asegúrate de que sea segura.
        </p>
      </CardHeader>
      <CardBody>
        <ResetPasswordForm token={token} />
      </CardBody>
    </Card>
  );
};

export default ResetPasswordCard;