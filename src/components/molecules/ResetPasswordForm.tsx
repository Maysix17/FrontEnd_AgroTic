import React, { useState } from "react";
import type { ResetPasswordFormValues } from "../../types/ResetPasswordForm.types";
import PrimaryButton from "../atoms/PrimaryButton";
import { resetPassword } from "../../services/ResetPasswordService";
import { useSearchParams } from "react-router-dom";

const ResetPasswordForm: React.FC = () => {
  const [form, setForm] = useState<ResetPasswordFormValues>({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    if (!form.password || !form.confirmPassword) {
      setError("Completa todos los campos.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (!token) {
      setError(
        "Token inválido o expirado. Por favor, solicita un nuevo enlace de recuperación."
      );
      return;
    }
    setIsLoading(true);
    try {
      // Cambia aquí para enviar los nombres correctos al backend
      await resetPassword(token, form.password, form.confirmPassword);
      setSuccessMessage(
        "¡Contraseña actualizada correctamente! Ya puedes iniciar sesión."
      );
      setForm({ password: "", confirmPassword: "" });
    } catch (error: any) {
      setError(
        error.response?.data?.message || "Error al actualizar la contraseña."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="password"
        name="password"
        placeholder="Nueva contraseña"
        value={form.password}
        onChange={handleChange}
        className="border rounded px-3 py-2 w-full"
        disabled={isLoading}
      />
      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirma contraseña"
        value={form.confirmPassword}
        onChange={handleChange}
        className="border rounded px-3 py-2 w-full"
        disabled={isLoading}
      />
      {error && <p className="text-center text-red-500 text-sm">{error}</p>}
      {successMessage && (
        <p className="text-center text-green-500 text-sm">{successMessage}</p>
      )}
      <PrimaryButton
        text="Cambiar contraseña"
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 w-full disabled:bg-green-400"
        disabled={isLoading}
      />
    </form>
  );
};

export default ResetPasswordForm;