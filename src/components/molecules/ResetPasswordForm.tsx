import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../atoms/PrimaryButton";
import UserInputs from "../atoms/UserInputs";
import type { ResetPasswordFormProps } from "../../types/ResetPassword.types";
import { resetPassword } from "../../services/authService";

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ onReset, token }) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!password || !confirmPassword) {
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
    if (!token) {
      setMessage("Token de restablecimiento no válido o ausente.");
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(password, token);
      setMessage("Contraseña actualizada con éxito. Serás redirigido al login.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      setMessage(error.message || "Error al actualizar la contraseña.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <UserInputs
        password={password}
        setPassword={setPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
      />

      {message && <p className="text-center text-red-500">{message}</p>}

      <PrimaryButton
        text="Actualizar Contraseña"
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 w-full"
        disabled={isLoading}
      />
    </form>
  );
};

export default ResetPasswordForm;