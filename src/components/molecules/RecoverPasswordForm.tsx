import React, { useState } from "react";
import CustomButton from "../atoms/Boton";
import { recoverPassword } from "../../services/RecoverPasswordService"; // 👈 importamos el servicio

const RecoverPasswordForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email) {
      setError("Por favor, ingresa tu correo electrónico.");
      return;
    }

    setIsLoading(true);
    try {
      const data = await recoverPassword(email); //  usamos el servicio
      setSuccessMessage(
        data.message || "Se ha enviado un enlace de recuperación a tu correo."
      );
      setEmail("");
    } catch (error: any) {
      setError(
        error.response?.data?.message || "Error al intentar recuperar contraseña."
      );
    } finally {
      setIsLoading(false);
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
        disabled={isLoading}
      />

      {error && <p className="text-center text-red-500 text-sm">{error}</p>}
      {successMessage && <p className="text-center text-green-500 text-sm">{successMessage}</p>}

      <CustomButton
        text="Enviar"
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 w-full disabled:bg-green-400"
        disabled={isLoading}
      />
    </form>
  );
};

export default RecoverPasswordForm;
