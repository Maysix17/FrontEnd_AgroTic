import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import PrimaryButton from "../atoms/PrimaryButton";
import TextInput from "../atoms/TextInput";
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

  const handleFieldChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Datos de registro:", formData);

    // 👉 Si viene el callback, lo ejecutamos
    if (onRegister) {
      onRegister(formData);
    }

    // Redirección ejemplo
    navigate("/login");
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        label="Nombres"
        placeholder="Ingrese un nombre"
        value={formData.nombres}
        onChange={handleFieldChange("nombres")}
      />

      <TextInput
        label="Apellidos"
        placeholder="Ingrese un apellido"
        value={formData.apellidos}
        onChange={handleFieldChange("apellidos")}
      />

      <TextInput
        label="DNI"
        placeholder="Ingrese DNI"
        value={formData.dni}
        onChange={handleFieldChange("dni")}
      />

      <TextInput
        label="Teléfono"
        placeholder="Ingrese un teléfono"
        value={formData.telefono}
        onChange={handleFieldChange("telefono")}
      />

      <TextInput
        label="Contraseña"
        type="password"
        placeholder="Ingrese contraseña"
        value={formData.password}
        onChange={handleFieldChange("password")}
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
