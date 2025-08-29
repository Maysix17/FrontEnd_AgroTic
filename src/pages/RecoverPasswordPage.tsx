import React from "react";
import RecoverPasswordCard from "../components/organisms/RecoverPasswordCard";
import logo from "../assets/AgroTic.png";

const RecoverPasswordPage: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-white px-6">
      {/* Columna izquierda con logo y texto */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <img src={logo} alt="Logo" className="w-90 h-auto mb-6" />
      </div>

      {/* Columna derecha con tarjeta de recuperación */}
      <div className="flex-1 flex justify-center mt-10 md:mt-0">
        <RecoverPasswordCard /> {/* No necesita props */}
      </div>
    </div>
  );
};

export default RecoverPasswordPage;
