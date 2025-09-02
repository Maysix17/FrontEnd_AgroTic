import React, { useState } from "react";
import PrimaryButton from "../atoms/PrimaryButton";
import UserInputs from "../atoms/UserInputs";
import type { RecoverPasswordFormProps } from "../../interfaces/Recover";

const RecoverPasswordForm: React.FC<RecoverPasswordFormProps> = ({ onRecover }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      setMessage("Por favor, completa todos los campos.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 6) {
      setMessage("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (onRecover) {
      onRecover(email, password);
    }

    console.log("Nueva contraseña:", password);
    setMessage("Contraseña actualizada con éxito.");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <UserInputs
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
      />

      {message && <p className="text-center text-red-500">{message}</p>}

      <PrimaryButton
        text="Enviar"
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 w-full"
      />

      <a
        href="/login"
        className="text-xs mt-2 text-gray-500 hover:underline w-full text-center block"
      >
        ¿Iniciar Sesión?
      </a>
    </form>
  );
};

export default RecoverPasswordForm;
