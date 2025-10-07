import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, Input, Select, SelectItem, Button, Chip, Textarea } from '@heroui/react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import InputSearch from '../atoms/buscador';
import userSearchService from '../../services/userSearchService';
import { inventoryService } from '../../services/inventoryService';
import zoneSearchService from '../../services/zoneSearchService';
import categoriaService from '../../services/categoriaService';

interface Usuario {
  id: string;
  dni: number;
  nombres: string;
  apellidos: string;
}

interface Material {
  id: string;
  nombre: string;
  categoria: string;
  stock: number;
  stock_disponible?: number;
  stock_devuelto?: number;
  stock_sobrante?: number;
}

interface Categoria {
  id: string;
  nombre: string;
}

interface Zona {
  id: string;
  nombre: string;
}

interface ActividadModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onSave: (data: any) => void;
}

const ActividadModal: React.FC<ActividadModalProps> = ({ isOpen, onClose, selectedDate, onSave }) => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [usuarioSearch, setUsuarioSearch] = useState('');
  const [materialSearch, setMaterialSearch] = useState('');
  const [loteSearch, setLoteSearch] = useState('');

  const [debouncedUsuarioSearch, setDebouncedUsuarioSearch] = useState('');
  const [debouncedMaterialSearch, setDebouncedMaterialSearch] = useState('');
  const [debouncedLoteSearch, setDebouncedLoteSearch] = useState('');

  const [selectedUsuarios, setSelectedUsuarios] = useState<Usuario[]>([]);
  const [selectedMateriales, setSelectedMateriales] = useState<{ [key: string]: { material: Material; qty: number; custom: boolean; isSurplus?: boolean } }>({});
  const [selectedLote, setSelectedLote] = useState<Zona | null>(null);

  const [categoria, setCategoria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [lote, setLote] = useState('');

  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([]);
  const [filteredMateriales, setFilteredMateriales] = useState<Material[]>([]);
  const [filteredZonas, setFilteredZonas] = useState<Zona[]>([]);

  /*cambios importantes */
  // Fetch categorias
  // Fetch data on open
  useEffect(() => {
    if (isOpen) {
      fetchCategorias();
    }
  }, [isOpen]);

  // Debounce usuario search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUsuarioSearch(usuarioSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [usuarioSearch]);

  // Debounce material search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedMaterialSearch(materialSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [materialSearch]);

  // Debounce lote search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedLoteSearch(loteSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [loteSearch]);


  const fetchCategorias = async () => {
    try {
      const data = await categoriaService.getAll();
      setCategorias(data);
    } catch (error) {
      console.error('Error fetching categorias:', error);
    }
  };

  // Filter usuarios with search
  useEffect(() => {
    const fetchFilteredUsuarios = async () => {
      if (debouncedUsuarioSearch.trim()) {
        try {
          const data = await userSearchService.search(debouncedUsuarioSearch);
          setFilteredUsuarios(data.items);
        } catch (error) {
          console.error('Error searching usuarios:', error);
          setFilteredUsuarios([]);
        }
      } else {
        setFilteredUsuarios([]);
      }
    };
    fetchFilteredUsuarios();
  }, [debouncedUsuarioSearch]);

  // Filter materiales with search
  useEffect(() => {
    const fetchFilteredMateriales = async () => {
      if (debouncedMaterialSearch.trim()) {
        try {
          const data = await inventoryService.search(debouncedMaterialSearch);
          const mapped = data.items.map((item: any) => ({
            id: item.id,
            nombre: item.nombre,
            categoria: item.categoria?.nombre || '',
            stock: item.stock,
            stock_disponible: item.stock_disponible || item.stock,
            stock_devuelto: item.stock_devuelto || 0,
            stock_sobrante: item.stock_sobrante || 0,
          }));
          setFilteredMateriales(mapped);
        } catch (error) {
          console.error('Error searching materiales:', error);
          setFilteredMateriales([]);
        }
      } else {
        setFilteredMateriales([]);
      }
    };
    fetchFilteredMateriales();
  }, [debouncedMaterialSearch]);

  // Filter zonas with search
  useEffect(() => {
    const fetchFilteredZonas = async () => {
      if (debouncedLoteSearch.trim()) {
        try {
          const data = await zoneSearchService.search(debouncedLoteSearch);
          setFilteredZonas(data.items);
        } catch (error) {
          console.error('Error searching zonas:', error);
          setFilteredZonas([]);
        }
      } else {
        setFilteredZonas([]);
      }
    };
    fetchFilteredZonas();
  }, [debouncedLoteSearch]);

  const handleSelectUsuario = (usuario: Usuario) => {
    if (!selectedUsuarios.some(u => u.id === usuario.id)) {
      setSelectedUsuarios([...selectedUsuarios, usuario]);
    }
  };

  const handleRemoveUsuario = (id: string) => {
    setSelectedUsuarios(selectedUsuarios.filter(u => u.id !== id));
  };

  const handleSelectMaterial = (material: Material) => {
    if (selectedMateriales[material.id]) {
      const newSelected = { ...selectedMateriales };
      delete newSelected[material.id];
      setSelectedMateriales(newSelected);
    } else {
      setSelectedMateriales({
        ...selectedMateriales,
        [material.id]: {
          material,
          qty: 0,
          custom: false,
          isSurplus: false
        }
      });
    }
  };

  const handleQtyChange = (id: string, qty: number) => {
    setSelectedMateriales({
      ...selectedMateriales,
      [id]: {
        ...selectedMateriales[id],
        qty,
        custom: true
      }
    });
  };

  const handleSelectLote = (zona: Zona) => {
    setSelectedLote(zona);
    setLote(zona.nombre);
    setLoteSearch('');
  };

  const handleRemoveLote = () => {
    setSelectedLote(null);
    setLote('');
  };

  const handleUseSurplus = (id: string) => {
    const material = selectedMateriales[id].material;
    const surplus = material.stock_sobrante || 0;
    // Show confirmation dialog
    const confirmed = window.confirm(
      `¿Desea usar el sobrante de ${surplus} unidades de ${material.nombre}? ` +
      `(Stock disponible: ${material.stock_disponible || material.stock})`
    );
    if (confirmed) {
      setSelectedMateriales({
        ...selectedMateriales,
        [id]: {
          ...selectedMateriales[id],
          qty: surplus,
          custom: false,
          isSurplus: true
        }
      });
    }
  };

  const handleSave = async () => {
    // Validate stock availability
    const validationPromises = Object.values(selectedMateriales).map(async (mat) => {
      if (mat.isSurplus) {
        const surplusStock = mat.material.stock_sobrante || 0;
        if (mat.qty > surplusStock) {
          return { valid: false, material: mat.material.nombre, requested: mat.qty, available: surplusStock, type: 'sobrante' };
        }
      } else {
        const availableStock = mat.material.stock_disponible || mat.material.stock;
        if (mat.qty > availableStock) {
          return { valid: false, material: mat.material.nombre, requested: mat.qty, available: availableStock, type: 'disponible' };
        }
      }
      return { valid: true };
    });

    const validationResults = await Promise.all(validationPromises);
    const invalidResults = validationResults.filter(result => !result.valid);

    if (invalidResults.length > 0) {
      const messages = invalidResults.map(result => {
        const stockType = result.type === 'sobrante' ? 'sobrante' : 'disponible';
        return `${result.material}: solicitado ${result.requested}, ${stockType} ${result.available}`;
      });
      alert(`No hay suficiente stock para:\n${messages.join('\n')}`);
      return;
    }

    const data = {
      fecha: selectedDate,
      usuarios: selectedUsuarios.map(u => u.id),
      materiales: Object.values(selectedMateriales).map(mat => ({ id: mat.material.id, nombre: mat.material.nombre, qty: mat.qty, isSurplus: mat.isSurplus })),
      categoria,
      descripcion,
      lote
    };
    onSave(data);
    onClose();
  };

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
            {/* Left Panel: Usuarios */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Usuario Asignado</label>
                <Input
                  placeholder="Buscar Documento..."
                  value={usuarioSearch}
                  onChange={(e) => setUsuarioSearch(e.target.value)}
                  startContent={<MagnifyingGlassIcon className="w-4 h-4" />}
                />
                <div className="mt-2 max-h-40 overflow-auto border rounded p-2">
                  {filteredUsuarios.slice(0, 10).map((usuario) => (
                    <button
                      key={usuario.id}
                      className="w-full text-left p-2 hover:bg-gray-100 rounded"
                      onClick={() => handleSelectUsuario(usuario)}
                    >
                      {usuario.dni}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Seleccionados</label>
                <div className="flex flex-wrap gap-2">
                  {selectedUsuarios.map((usuario) => (
                    <Chip key={usuario.id} onClose={() => handleRemoveUsuario(usuario.id)} variant="flat">
                      {usuario.dni}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Panel: Materiales */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Insumos / Materiales</label>
                <Input
                  placeholder="Buscar..."
                  value={materialSearch}
                  onChange={(e) => setMaterialSearch(e.target.value)}
                  startContent={<MagnifyingGlassIcon className="w-4 h-4" />}
                />
                <div className="mt-2 max-h-40 overflow-auto border rounded p-2">
                  {filteredMateriales.slice(0, 10).map((material) => (
                    <button
                      key={material.id}
                      className="w-full text-left p-2 hover:bg-gray-100 rounded"
                      onClick={() => handleSelectMaterial(material)}
                    >
                      {material.nombre}
                    </button>
                  ))}
                </div>
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
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-4">
              <Select
                label="Seleccione categoría"
                selectedKeys={categoria ? [categoria] : []}
                onSelectionChange={(keys) => setCategoria(Array.from(keys)[0] as string)}
              >
                {Array.isArray(categorias) ? categorias.map((cat) => (
                  <SelectItem key={cat.id}>
                    {cat.nombre}
                  </SelectItem>
                )) : []}
              </Select>
              <Textarea
                label="Descripción"
                placeholder="Escriba..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium mb-2">Seleccione un lote</label>
              <InputSearch
                placeholder="Buscar lote a seleccionar..."
                value={loteSearch}
                onChange={(e) => setLoteSearch(e.target.value)}
              />
              <div className="max-h-20 overflow-auto border rounded p-2">
                {filteredZonas.map((zona) => (
                  <button
                    key={zona.id}
                    className="w-full text-left p-2 hover:bg-gray-100 rounded"
                    onClick={() => handleSelectLote(zona)}
                  >
                    {zona.nombre}
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Seleccionado</label>
                <div className="flex flex-wrap gap-2">
                  {selectedLote && (
                    <Chip key={selectedLote.id} onClose={handleRemoveLote} variant="flat">
                      {selectedLote.nombre}
                    </Chip>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="light" onClick={onClose}>
                  Cancelar
                </Button>
                <Button color="primary" onClick={handleSave}>
                  Guardar actividad
                </Button>
              </div>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ActividadModal;