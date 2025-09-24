import React, { useState } from "react";
import TextInput from "../atoms/TextInput";
import PrimaryButton from "../atoms/PrimaryButton";
import type { TipoCultivoData } from "../../types/tipoCultivo.types";
import { registerTipoCultivo } from "../../services/tipoCultivo";

const TipoCultivoForm = () => {
  const [tipoCultivoData, setTipoCultivoData] = useState<TipoCultivoData>({
    nombre: "",
  });
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await registerTipoCultivo(tipoCultivoData);
      setMessage(response.message);
      setTipoCultivoData({ nombre: "" });
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <TextInput
        label="Nombre Tipo de Cultivo"
        placeholder="Ingrese el nombre"
        value={tipoCultivoData.nombre}
        onChange={(e) =>
          setTipoCultivoData({ ...tipoCultivoData, nombre: e.target.value })
        }
      />

      {message && <p className="text-center text-green-600">{message}</p>}

      <PrimaryButton
        type="submit"
        text="Registrar"
        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 w-full"
      />
    </form>
  );
};

export default TipoCultivoForm;
