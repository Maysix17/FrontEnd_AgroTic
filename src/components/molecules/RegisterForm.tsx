import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import PrimaryButton from "../atoms/PrimaryButton";
import UserInputs from "../atoms/UserInputs";
import type { RegisterFormProps } from "../../interfaces/Register";

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    dni: "",
    telefono: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos de registro:", formData);
    if (onRegister) {
      onRegister(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <UserInputs
        nombres={formData.nombres}
        setNombres={(val) => setFormData({ ...formData, nombres: val })}
        apellidos={formData.apellidos}
        setApellidos={(val) => setFormData({ ...formData, apellidos: val })}
        dni={formData.dni}
        setDni={(val) => setFormData({ ...formData, dni: val })}
        telefono={formData.telefono}
        setTelefono={(val) => setFormData({ ...formData, telefono: val })}
        password={formData.password}
        setPassword={(val) => setFormData({ ...formData, password: val })}
      />

      <PrimaryButton
        text="Registrarse"
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 w-full"
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




