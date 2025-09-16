import React, { useState } from "react";
import PrimaryButton from "../atoms/PrimaryButton";
import UserInputs from "../atoms/UserInputs";
import type { RecoverPasswordFormProps } from "../../types/Recover.types";
import { recoverPassword } from "../../services/authService";

const RecoverPasswordForm: React.FC<RecoverPasswordFormProps> = ({ onRecover }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!email) {
      setMessage("Por favor, ingresa tu correo electrónico.");
      return;
    }

    setIsLoading(true);
    try {
      await recoverPassword(email);
      setMessage(
        "Si el correo está registrado, recibirás un enlace para recuperar tu contraseña."
      );
      setEmail("");
    } catch (error: any) {
      setMessage(error.message || "Ocurrió un error al enviar el correo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <UserInputs email={email} setEmail={setEmail} />

      {message && <p className="text-center text-red-500">{message}</p>}

      <PrimaryButton
        text="Enviar"
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 w-full"
        disabled={isLoading}
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
