import React from "react";
import { useNavigate } from "react-router-dom";
import LoginCard from "../components/organisms/LoginCard";
import logo from "../assets/AgroTic.png";
import { usePermission } from "../contexts/PermissionContext";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = usePermission();

  const handleLogin = async (payload: { dni: number; password: string }) => {
    try {
      await login(payload);
      navigate("/menu");
    } catch (error) {
      console.error("Login failed:", error);
      // Optionally show error message
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-white px-6">
      {/* Columna izquierda con logo */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <img src={logo} alt="Logo" className="w-90 h-auto mb-6" />
      </div>

      {/* Columna derecha con LoginCard */}
      <div className="flex-1 flex justify-center mt-10 md:mt-0">
        <LoginCard onLogin={handleLogin} />
      </div>
    </div>
  );
};

export default LoginPage;




