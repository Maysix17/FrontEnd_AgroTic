import React from "react";
import { Card, CardHeader, CardBody } from "@heroui/react";
import LoginForm from "../molecules/LoginForm";

const LoginCard: React.FC = () => {
  return (
    <Card className="p-6 w-full max-w-sm shadow-lg">
      <CardHeader className="flex flex-col items-center text-center">
        <h2 className="text-2xl font-bold">Inicia Sesión</h2>
        <p className="text-sm text-gray-500">Inicie sesión en tu cuenta</p>
      </CardHeader>
      <CardBody>
        <LoginForm />
      </CardBody>
    </Card>
  );
};

export default LoginCard;
