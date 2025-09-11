import React from "react";
import perfil from "../../assets/perfil.png";

const Header: React.FC = () => {
  return (
    <header className="w-full bg-green-600 text-white flex justify-between items-center px-6 py-3 shadow-md">
      {/* Logo o título */}
      <h1 className="text-lg font-bold">AgroTic</h1>

      {/* Usuario con foto a la derecha */}
      <div className="flex items-center space-x-3">
        <span className="text-sm">Usuario</span>
        <img
          src={perfil}
          alt="Foto de perfil"
          className="w-10 h-10 rounded-full border-2 border-white shadow-md"
        />
      </div>
    </header>
  );
};

export default Header;
