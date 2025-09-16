import React, { useState } from "react";
import PrimaryButton from "../atoms/PrimaryButton";
import UserInputs from "../atoms/UserInputs";
import { useAuth } from "../../context/AuthContext";
import type { LoginPayload } from "../../types/Auth";

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<LoginPayload>({
    dni: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.dni || !formData.password) {
      setError("Por favor, complete todos los campos.");
      return;
    }
    try {
      await login(formData);
      // La navegación se maneja en el AuthContext
    } catch (err) {
      setError("DNI o contraseña incorrectos. Inténtalo de nuevo.");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <UserInputs
        dni={formData.dni}
        setDni={(val) => setFormData({ ...formData, dni: val })}
        password={formData.password}
        setPassword={(val) => setFormData({ ...formData, password: val })}
      />

      {error && <p className="text-center text-red-500 text-sm">{error}</p>}

      <PrimaryButton
        text="Iniciar sesión"
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 w-full disabled:bg-green-400"
        disabled={isLoading}
      />

      <a
        href="/register"
        className="text-xs mt-2 text-gray-500 hover:underline w-full text-center block"
      >
        ¿No tienes una cuenta? Regístrate
      </a>
      <a
        href="/recover-password"
        className="text-xs mt-2 text-gray-500 hover:underline w-full text-center block"
      >
        ¿Olvidaste tu contraseña?
      </a>
    </form>
  );
};

export default LoginForm;
