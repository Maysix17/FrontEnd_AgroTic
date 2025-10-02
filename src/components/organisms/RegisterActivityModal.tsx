import React, { useState } from 'react';
import Button from '../atoms/Boton';
import SearchableSelect from '../molecules/SearchableSelect';

interface Item { id: string; name: string; }

interface Props {
  open: boolean;
  onClose: () => void;
  onRegister: (data: any) => void;
  usuarios: Item[];
  insumos: Item[];
  zonas: Item[];
  categorias: Item[]; // 👈 nuevo
}

const RegisterActivityModal: React.FC<Props> = ({
  open,
  onClose,
  onRegister,
  usuarios,
  insumos,
  zonas,
  categorias,
}) => {
  const [descripcion, setDescripcion] = useState("");
  const [selectedUsuario, setSelectedUsuario] = useState<Item | null>(null);
  const [selectedInsumo, setSelectedInsumo] = useState<Item | null>(null);
  const [selectedCategoria, setSelectedCategoria] = useState<Item | null>(null);
  const [fkCultivoVariedadZonaId, setFkCultivoVariedadZonaId] = useState("");
  const [nombreZona, setNombreZona] = useState("");

  if (!open) return null;

  const handleSubmit = () => {
    onRegister({
      descripcion,
      categoria: selectedCategoria?.name || undefined,
      dniUsuario: selectedUsuario?.id || undefined,
      nombreInventario: selectedInsumo?.name || undefined,
      fkCultivoVariedadZonaId,
      nombreZona,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded w-2/3 max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl font-bold"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4">Registrar nueva actividad</h2>

        {/* Usuario (DNI) */}
        <SearchableSelect
          label="Aprendiz asignado (DNI)"
          options={usuarios}
          selected={selectedUsuario ? [selectedUsuario] : []}
          onSelect={(item) => setSelectedUsuario(item)}
          onRemove={() => setSelectedUsuario(null)}
        />

        {/* Insumo/Material */}
        <SearchableSelect
          label="Insumo/Material"
          options={insumos}
          selected={selectedInsumo ? [selectedInsumo] : []}
          onSelect={(item) => setSelectedInsumo(item)}
          onRemove={() => setSelectedInsumo(null)}
        />

        {/* Categoría */}
        <select
        value={selectedCategoria?.id || ""}
        onChange={(e) => {
            const selected = categorias.find((c) => c.id === e.target.value) || null;
            setSelectedCategoria(selected);
        }}
         className="border p-2 rounded w-full mb-4">
            <option value="">Seleccione la categoría</option>
            {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                    {c.name}
                    </option>
            ))}
            </select>

        {/* Descripción */}
        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />

        {/* Zona */}
        <select
          value={fkCultivoVariedadZonaId}
          onChange={(e) => setFkCultivoVariedadZonaId(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        >
          <option value="">Seleccione la zona</option>
          {zonas.map((z) => (
            <option key={z.id} value={z.id}>
              {z.name}
            </option>
          ))}
        </select>

        {/* Nombre zona opcional */}
        <input
          type="text"
          placeholder="Nombre de la zona (opcional)"
          value={nombreZona}
          onChange={(e) => setNombreZona(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />

        <Button onClick={handleSubmit}>Registrar</Button>
      </div>
    </div>
  );
};

export default RegisterActivityModal;

