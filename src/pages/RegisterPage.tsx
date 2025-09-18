import React from "react";
import { useNavigate } from "react-router-dom";
import RegisterCard from "../components/organisms/RegisterCard";
import logo from "../assets/AgroTic.png";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRegister = (data: {
    nombres: string;
    apellidos: string;
    dni: string;
    telefono: string;
    password: string;
  }) => {
    console.log("Registrando usuario:", data);
    navigate("/app");
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-white px-6">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <img src={logo} alt="Logo" className="w-90 h-auto mb-6" />
      </div>

      <div className="flex-1 flex justify-center mt-10 md:mt-0">
        <RegisterCard onRegister={handleRegister} />
      </div>
    </div>
  );
};

export default RegisterPage;
