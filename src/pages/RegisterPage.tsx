import React from "react";
import { useNavigate } from "react-router-dom";
import RegisterCard from "../components/organisms/RegisterCard";
import logo from "../assets/AgroTic.png";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRegister = () => {
    // Aquí podrías manejar la acción de registro real
    navigate("/menu"); // Redirige al menú después del registro
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-white px-6">
      {/* Columna izquierda con logo */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <img src={logo} alt="Logo" className="w-90 h-auto mb-6" />
      </div>

      {/* Columna derecha con RegisterCard */}
      <div className="flex-1 flex justify-center mt-10 md:mt-0">
        <RegisterCard onRegister={handleRegister} />
      </div>
    </div>
  );
};

export default RegisterPage;
