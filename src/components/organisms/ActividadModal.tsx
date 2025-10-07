import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
  Select,
  SelectItem,
  Button,
  Chip,
  Textarea,
} from "@heroui/react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import InputSearch from "../atoms/buscador";
import userSearchService from "../../services/userSearchService";
import { inventoryService } from "../../services/inventoryService";
import zoneSearchService from "../../services/zoneSearchService";
import categoriaService from "../../services/categoriaService";
import type { ActividadModalProps, Usuario, Material, Categoria, Zona } from "../../types/ActividadModal.types";

const ActividadModal: React.FC<ActividadModalProps> = ({ isOpen, onClose, selectedDate, onSave }) => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [usuarioSearch, setUsuarioSearch] = useState("");
  const [materialSearch, setMaterialSearch] = useState("");
  const [loteSearch, setLoteSearch] = useState("");
  const [debouncedUsuarioSearch, setDebouncedUsuarioSearch] = useState("");
  const [debouncedMaterialSearch, setDebouncedMaterialSearch] = useState("");
  const [debouncedLoteSearch, setDebouncedLoteSearch] = useState("");
  const [selectedUsuarios, setSelectedUsuarios] = useState<Usuario[]>([]);
  const [selectedMateriales, setSelectedMateriales] = useState<{
    [key: string]: { material: Material; qty: number; custom: boolean; isSurplus?: boolean };
  }>({});
  const [selectedLote, setSelectedLote] = useState<Zona | null>(null);
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [lote, setLote] = useState("");
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([]);
  const [filteredMateriales, setFilteredMateriales] = useState<Material[]>([]);
  const [filteredZonas, setFilteredZonas] = useState<Zona[]>([]);

  // Fetch categorias
  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        const data = await categoriaService.getAll();
        setCategorias(data);
      } catch (error) {
        console.error("Error fetching categorias:", error);
      }
    })();
  }, [isOpen]);

  // Debounce searches
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedUsuarioSearch(usuarioSearch), 300);
    return () => clearTimeout(timer);
  }, [usuarioSearch]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedMaterialSearch(materialSearch), 300);
    return () => clearTimeout(timer);
  }, [materialSearch]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedLoteSearch(loteSearch), 300);
    return () => clearTimeout(timer);
  }, [loteSearch]);

  // Fetch filtered usuarios
  useEffect(() => {
    const fetchUsuarios = async () => {
      if (!debouncedUsuarioSearch.trim()) return setFilteredUsuarios([]);
      try {
        const data = await userSearchService.search(debouncedUsuarioSearch);
        setFilteredUsuarios(data.items);
      } catch {
        setFilteredUsuarios([]);
      }
    };
    fetchUsuarios();
  }, [debouncedUsuarioSearch]);

  // Fetch filtered materiales
  useEffect(() => {
    const fetchMateriales = async () => {
      if (!debouncedMaterialSearch.trim()) return setFilteredMateriales([]);
      try {
        const data = await inventoryService.search(debouncedMaterialSearch);
        const mapped = data.items.map((item: any) => ({
          id: item.id,
          nombre: item.nombre,
          categoria: item.categoria?.nombre || "",
          stock: item.stock,
          stock_disponible: item.stock_disponible ?? item.stock,
          stock_devuelto: item.stock_devuelto ?? 0,
          stock_sobrante: item.stock_sobrante ?? 0,
        }));
        setFilteredMateriales(mapped);
      } catch {
        setFilteredMateriales([]);
      }
    };
    fetchMateriales();
  }, [debouncedMaterialSearch]);

  // Fetch filtered zonas
  useEffect(() => {
    const fetchZonas = async () => {
      if (!debouncedLoteSearch.trim()) return setFilteredZonas([]);
      try {
        const data = await zoneSearchService.search(debouncedLoteSearch);
        setFilteredZonas(data.items);
      } catch {
        setFilteredZonas([]);
      }
    };
    fetchZonas();
  }, [debouncedLoteSearch]);

  /** HANDLERS */
  const handleSelectUsuario = (u: Usuario) => {
    if (!selectedUsuarios.some(s => s.id === u.id)) setSelectedUsuarios([...selectedUsuarios, u]);
  };
  const handleRemoveUsuario = (id: string) => setSelectedUsuarios(selectedUsuarios.filter(u => u.id !== id));

  const handleSelectMaterial = (m: Material) => {
    if (selectedMateriales[m.id]) {
      const copy = { ...selectedMateriales };
      delete copy[m.id];
      setSelectedMateriales(copy);
    } else {
      setSelectedMateriales({ ...selectedMateriales, [m.id]: { material: m, qty: 0, custom: false } });
    }
  };

  const handleQtyChange = (id: string, qty: number) => {
    setSelectedMateriales({
      ...selectedMateriales,
      [id]: { ...selectedMateriales[id], qty, custom: true },
    });
  };

  const handleSelectLote = (z: Zona) => {
    setSelectedLote(z);
    setLote(z.nombre);
    setLoteSearch("");
  };

  const handleRemoveLote = () => {
    setSelectedLote(null);
    setLote("");
  };

  const handleUseSurplus = (id: string) => {
    const mat = selectedMateriales[id].material;
    const surplus = mat.stock_sobrante ?? 0;
    if (!surplus) return;
    const confirmed = window.confirm(
      `¿Desea usar el sobrante de ${surplus} unidades de ${mat.nombre}? (Disponible: ${mat.stock_disponible ?? mat.stock})`
    );
    if (confirmed) {
      setSelectedMateriales({
        ...selectedMateriales,
        [id]: { ...selectedMateriales[id], qty: surplus, custom: false, isSurplus: true },
      });
    }
  };

  /** GUARDAR ACTIVIDAD */
  const handleSave = async () => {
    const validations = Object.values(selectedMateriales).map(mat => {
      const available = mat.isSurplus ? mat.material.stock_sobrante ?? 0 : mat.material.stock_disponible ?? mat.material.stock;
      if (mat.qty > available) return { valid: false, material: mat.material.nombre, requested: mat.qty, available, type: mat.isSurplus ? "sobrante" : "disponible" };
      return { valid: true };
    });

    const invalids = validations.filter(v => !v.valid);
    if (invalids.length > 0) {
      alert(`No hay suficiente stock:\n${invalids.map(v => `${v.material}: solicitado ${v.requested}, ${v.type} ${v.available}`).join("\n")}`);
      return;
    }

    const data = {
      fecha: selectedDate,
      usuarios: selectedUsuarios.map(u => u.id),
      materiales: Object.values(selectedMateriales).map(mat => ({ id: mat.material.id, nombre: mat.material.nombre, qty: mat.qty, isSurplus: mat.isSurplus })),
      categoria,
      descripcion,
      lote,
    };
    onSave(data);
    onClose();
  };

  /** JSX COMPLETO */
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="5xl">
      <ModalContent className="bg-white p-6">
        <ModalHeader>
          <h2 className="text-2xl font-semibold">Registrar nueva actividad</h2>
          <Button isIconOnly variant="light" onClick={onClose}>
            <XMarkIcon className="w-6 h-6" />
          </Button>
        </ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* USUARIOS */}
            <div className="space-y-4">
              <label className="block text-sm font-medium">Usuario Asignado</label>
              <Input
                placeholder="Buscar Documento..."
                value={usuarioSearch}
                onChange={(e) => setUsuarioSearch(e.target.value)}
                startContent={<MagnifyingGlassIcon className="w-4 h-4" />}
              />
              <div className="max-h-40 overflow-auto border rounded p-2">
                {filteredUsuarios.slice(0, 10).map(u => (
                  <button
                    key={u.id}
                    className="w-full text-left p-2 hover:bg-gray-100 rounded"
                    onClick={() => handleSelectUsuario(u)}
                  >
                    {u.dni} - {u.nombres} {u.apellidos}
                  </button>
                ))}
              </div>
              <label className="block text-sm font-medium">Seleccionados</label>
              <div className="flex flex-wrap gap-2">
                {selectedUsuarios.map(u => (
                  <Chip key={u.id} onClose={() => handleRemoveUsuario(u.id)} variant="flat">
                    {u.dni}
                  </Chip>
                ))}
              </div>
            </div>

            {/* MATERIALES */}
            <div className="space-y-4">
              <label className="block text-sm font-medium">Insumos / Materiales</label>
              <Input
                placeholder="Buscar..."
                value={materialSearch}
                onChange={(e) => setMaterialSearch(e.target.value)}
                startContent={<MagnifyingGlassIcon className="w-4 h-4" />}
              />
              <div className="max-h-40 overflow-auto border rounded p-2">
                {filteredMateriales.slice(0, 10).map(m => (
                  <button
                    key={m.id}
                    className="w-full text-left p-2 hover:bg-gray-100 rounded"
                    onClick={() => handleSelectMaterial(m)}
                  >
                    {m.nombre} ({m.categoria})
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Seleccionados</label>
                <div className="space-y-2">
                  {Object.values(selectedMateriales).map((mat) => {
                    const hasSurplus = (mat.material.stock_sobrante || 0) > 0;
                    const availableStock = mat.material.stock_disponible || mat.material.stock;
                    const isOverLimit = mat.qty > availableStock;
                    const showSurplusButton = hasSurplus && !mat.isSurplus;
                    return (
                      <div key={mat.material.id} className="flex items-center gap-2 p-2 border rounded">
                        <div className="flex-1">
                          <div className="font-medium">{mat.material.nombre}</div>
                          <div className="text-sm text-gray-600">
                            Disponible: {availableStock} | Sobrante: {mat.material.stock_sobrante || 0}
                          </div>
                        </div>
                        <Button size="sm" onClick={() => handleSelectMaterial(mat.material)}>
                          Remover
                        </Button>
                        <Input
                          type="number"
                          placeholder="Stock a apartar..."
                          value={mat.qty.toString()}
                          onChange={(e) => handleQtyChange(mat.material.id, Number(e.target.value))}
                          size="sm"
                          className={`w-32 ${isOverLimit ? 'border-red-500' : ''}`}
                          min="0"
                          max={availableStock}
                        />
                        {isOverLimit && (
                          <span className="text-red-500 text-sm">Excede stock disponible</span>
                        )}
                        {showSurplusButton && (
                          <Button size="sm" variant="ghost" onClick={() => handleUseSurplus(mat.material.id)}>
                            Usar Sobrante
                          </Button>
                        )}
                      </div>
                      <Button size="sm" onClick={() => handleSelectMaterial(mat.material)}>Remover</Button>
                      <Input
                        type="number"
                        value={mat.qty.toString()}
                        onChange={(e) => handleQtyChange(mat.material.id, Number(e.target.value))}
                        size="sm"
                        className={`w-32 ${overLimit ? "border-red-500" : ""}`}
                        min={0}
                        max={available}
                      />
                      {overLimit && <span className="text-red-500 text-sm">Excede stock</span>}
                      {hasSurplus && <Button size="sm" variant="ghost" onClick={() => handleUseSurplus(mat.material.id)}>Usar Sobrante</Button>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* BOTTOM FORM: CATEGORIA, DESCRIPCION, LOTE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-4">
              <Select
                label="Seleccione categoría"
                selectedKeys={categoria ? [categoria] : []}
                onSelectionChange={(keys) => setCategoria(Array.from(keys)[0] as string)}
              >
                {categorias.map(cat => <SelectItem key={cat.id}>{cat.nombre}</SelectItem>)}
              </Select>
              <Textarea
                label="Descripción"
                placeholder="Escriba..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium">Seleccione un lote</label>
              <InputSearch
                placeholder="Buscar lote..."
                value={loteSearch}
                onChange={(e) => setLoteSearch(e.target.value)}
              />
              <div className="max-h-20 overflow-auto border rounded p-2">
                {filteredZonas.map(z => (
                  <button
                    key={z.id}
                    className="w-full text-left p-2 hover:bg-gray-100 rounded"
                    onClick={() => handleSelectLote(z)}
                  >
                    {z.nombre}
                  </button>
                ))}
              </div>
              <label className="block text-sm font-medium">Seleccionado</label>
              <div className="flex flex-wrap gap-2">
                {selectedLote && <Chip onClose={handleRemoveLote} variant="flat">{selectedLote.nombre}</Chip>}
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <Button variant="light" onClick={onClose}>Cancelar</Button>
                <Button color="primary" onClick={handleSave}>Guardar actividad</Button>
              </div>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ActividadModal;
