import React, { useState, useEffect } from "react";
import TextInput from "../atoms/TextInput";
import PrimaryButton from "../atoms/PrimaryButton";
import type { TipoCultivoData } from "../../types/tipoCultivo.types";
import { registerTipoCultivo, updateTipoCultivo, getTipoCultivos } from "../../services/tipoCultivo";

interface TipoCultivoFormProps {
  editId?: string | null;
  onSuccess?: () => void;
}

const TipoCultivoForm: React.FC<TipoCultivoFormProps> = ({ editId, onSuccess }) => {
  const [tipoCultivoData, setTipoCultivoData] = useState<TipoCultivoData>({
    nombre: "",
  });
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (editId) {
      // Fetch the item to edit
      const fetchItem = async () => {
        try {
          const data = await getTipoCultivos();
          const item = data.find(c => c.id === editId);
          if (item) {
            setTipoCultivoData({ nombre: item.nombre });
          }
        } catch (err) {
          console.error('Error fetching item:', err);
        }
      };
      fetchItem();
    } else {
      setTipoCultivoData({ nombre: "" });
    }
  }, [editId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editId) {
        await updateTipoCultivo(editId, tipoCultivoData);
        setMessage("Actualizado con éxito");
      } else {
        const response = await registerTipoCultivo(tipoCultivoData);
        setMessage(response.message);
      }
      setTipoCultivoData({ nombre: "" });
      onSuccess?.();
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
        text={editId ? "Actualizar" : "Registrar"}
        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 w-full"
      />
    </form>
  );
};

export default TipoCultivoForm;
