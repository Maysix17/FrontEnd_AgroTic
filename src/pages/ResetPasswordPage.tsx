import React from "react";
import { Card, CardHeader, CardBody } from "@heroui/react";
import ResetPasswordForm from "../components/molecules/ResetPasswordForm";

const ResetPasswordPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="p-6 w-full max-w-sm shadow-lg">
        <CardHeader className="flex flex-col items-center text-center">
          <h2 className="text-2xl font-bold">Restablecer Contraseña</h2>
          <p className="text-sm text-gray-500">
            Ingresa tu nueva contraseña.
          </p>
        </CardHeader>
        <CardBody>
          <ResetPasswordForm />
        </CardBody>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;