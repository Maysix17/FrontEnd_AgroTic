import React, { useState } from "react";
import TextInput from "../atoms/TextInput";
import PrimaryButton from "../atoms/PrimaryButton";
import type { LoginFormProps } from "../../types/login.types";

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("DNI:", dni, "Password:", password);

    // siempre ejecuta login aunque no haya datos
    onLogin();
    setMessage(""); 
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        label="DNI"
        placeholder="Ingrese DNI"
        value={dni}
        onChange={(e) => setDni(e.target.value)}
      />
      <TextInput
        label="Contraseña"
        type="password"
        placeholder="Ingrese contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {message && <p className="text-center text-red-500">{message}</p>}

      <PrimaryButton
        text="Iniciar sesión"
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 w-full"
      />

      <a
        href="/register"
        className="text-xs mt-2 text-gray-500 hover:underline w-full text-center block"
      >
        ¿No tienes una cuenta? Registrate
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



