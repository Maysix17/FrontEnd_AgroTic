import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../atoms/PrimaryButton";
import UserInputs from "../atoms/UserInputs";
import type { RegisterFormProps } from "../../types/Register";
import type { RegisterFormData } from "../../types/Auth";
import { registerUser } from "../../services/authService";

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    nombres: "",
    apellidos: "",
    dni: "",
    telefono: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const data = await registerUser(formData);
      console.log("Registro exitoso:", data);
      if (onRegister) {
        onRegister(formData);
      }
      // Opcional: Redirigir al usuario tras un registro exitoso
      navigate("/login");
    } catch (err) {
      setError("Hubo un error al registrar la cuenta. Inténtalo de nuevo.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      <UserInputs
        nombres={formData.nombres}
        setNombres={(val) => setFormData({ ...formData, nombres: val })}
        apellidos={formData.apellidos}
        setApellidos={(val) => setFormData({ ...formData, apellidos: val })}
        dni={formData.dni}
        setDni={(val) => setFormData({ ...formData, dni: val })}
        email={formData.email}
        setEmail={(val) => setFormData({ ...formData, email: val })}
        telefono={formData.telefono}
        setTelefono={(val) => setFormData({ ...formData, telefono: val })}
        password={formData.password}
        setPassword={(val) => setFormData({ ...formData, password: val })}
      />

      <PrimaryButton
        text="Registrarse"
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 w-full disabled:bg-green-400"
        disabled={isLoading}
      />

      <a
        href="/login"
        className="text-xs mt-2 text-gray-500 hover:underline w-full text-center block"
      >
        ¿Ya tienes una cuenta? Iniciar sesión
      </a>
    </form>
  );
};

export default RegisterForm;
