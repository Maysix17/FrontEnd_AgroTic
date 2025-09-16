import React, { useState } from "react";
import PrimaryButton from "../atoms/PrimaryButton";
import { recoverPassword } from "../../services/RecoverPasswordService"; // 👈 importamos el servicio

const RecoverPasswordForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setMessage("Por favor, ingresa tu correo electrónico.");
      return;
    }

    try {
      const data = await recoverPassword(email); // 👈 usamos el servicio
      setMessage(data.message || "Se ha enviado un enlace de recuperación a tu correo.");
      setEmail("");
    } catch (error: any) {
      setMessage(
        error.response?.data?.message || "Error al intentar recuperar contraseña."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border rounded px-3 py-2 w-full"
      />

      {message && <p className="text-center text-red-500">{message}</p>}

      <PrimaryButton
        text="Enviar"
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 w-full"
      />
    </form>
  );
};

export default RecoverPasswordForm;
