import React from "react";
import { useParams } from "react-router-dom";
import ResetPasswordCard from "../components/organisms/ResetPasswordCard";

const ResetPasswordPage: React.FC = () => {
  // Obtenemos el token de la URL si existe
  const { token } = useParams<{ token?: string }>();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ResetPasswordCard token={token} />
    </div>
  );
};

export default ResetPasswordPage;