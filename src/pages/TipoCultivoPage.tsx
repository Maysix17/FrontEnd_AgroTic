import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { TipoCultivoData } from "../types/tipoCultivo.types";
import { registerTipoCultivo } from "../services/tipoCultivo";

const TipoCultivoPage = () => {
  const [tipoCultivoData, setTipoCultivoData] = useState<TipoCultivoData>({
    nombre: "",
  });
  const [message, setMessage] = useState<string>("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await registerTipoCultivo(tipoCultivoData);
      setMessage(response.message || "Registro exitoso");
      setTipoCultivoData({ nombre: "" }); // Limpiar el formulario
      setTimeout(() => {
        handleClose(); // Cierra el modal después de un registro exitoso
      }, 1500);
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Error en el registro");
    }
  };

  const handleClose = () => {
    navigate(-1); // vuelve a la página anterior
  };

  return (
    // Overlay semitransparente
    <div
      className="fixed inset-0 bg-gray-500 bg-opacity-10 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      {/* Modal */}
      <div
        className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()} // evita cerrar si clickeas dentro
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Registrar Tipo de Cultivo</h2>
          <button
            type="button"
            className="text-gray-500 hover:text-red-500 text-lg"
            onClick={handleClose}
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              value={tipoCultivoData.nombre}
              onChange={(e) =>
                setTipoCultivoData({
                  ...tipoCultivoData,
                  nombre: e.target.value,
                })
              }
              placeholder="Ingrese el nombre del tipo de cultivo"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          {message && (
            <p className="text-center text-green-600 text-sm">{message}</p>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-medium"
          >
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default TipoCultivoPage;
