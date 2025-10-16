import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, Button } from '@heroui/react';
import CustomButton from '../atoms/Boton';
import ImageUpload from '../atoms/ImagenUpload';
import Swal from 'sweetalert2';
import { inventoryService } from '../../services/inventoryService';
import type { Categoria, Bodega } from '../../services/inventoryService';

interface UnifiedProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductCreated: () => void;
}

const UnifiedProductModal: React.FC<UnifiedProductModalProps> = ({
  isOpen,
  onClose,
  onProductCreated,
}) => {
  const [formData, setFormData] = useState({
    // Product fields
    nombre: '',
    descripcion: '',
    sku: '',
    precioCompra: '',
    capacidadPresentacion: '',
    fkCategoriaId: '',
    fkUnidadMedidaId: '',
    // Lot inventory fields
    fkBodegaId: '',
    stock: '',
    fechaVencimiento: '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [bodegas, setBodegas] = useState<Bodega[]>([]);
  const [unidadesMedida, setUnidadesMedida] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      fetchCategorias();
      fetchBodegas();
      fetchUnidadesMedida();
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      sku: '',
      precioCompra: '',
      capacidadPresentacion: '',
      fkCategoriaId: '',
      fkUnidadMedidaId: '',
      fkBodegaId: '',
      stock: '',
      fechaVencimiento: '',
    });
    setSelectedFile(null);
    setErrors({});
  };

  const fetchCategorias = async () => {
    try {
      const data = await inventoryService.getCategorias();
      setCategorias(data);
    } catch (error) {
      console.error('Error fetching categorias:', error);
    }
  };

  const fetchBodegas = async () => {
    try {
      const data = await inventoryService.getBodegas();
      setBodegas(data);
    } catch (error) {
      console.error('Error fetching bodegas:', error);
    }
  };

  const fetchUnidadesMedida = async () => {
    try {
      const data = await inventoryService.getUnidadesMedida();
      setUnidadesMedida(data);
    } catch (error) {
      console.error('Error fetching unidades medida:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const data = {
        nombre: formData.nombre,
        descripcion: formData.descripcion || undefined,
        sku: formData.sku || undefined,
        precioCompra: parseFloat(formData.precioCompra),
        capacidadPresentacion: parseFloat(formData.capacidadPresentacion),
        fkCategoriaId: formData.fkCategoriaId || undefined,
        fkUnidadMedidaId: formData.fkUnidadMedidaId || undefined,
        fkBodegaId: formData.fkBodegaId,
        stock: parseFloat(formData.stock),
        fechaVencimiento: formData.fechaVencimiento || undefined,
      };

      await inventoryService.createProductoWithLote(data);

      Swal.fire({
        icon: 'success',
        title: 'Producto registrado',
        text: 'El producto y su lote de inventario han sido registrados exitosamente.',
        confirmButtonText: 'Aceptar',
      });

      onProductCreated();
      onClose();
      resetForm();
    } catch (error: any) {
      console.error('Error creating product with lote:', error);
      setErrors({ general: 'Error al registrar el producto.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="4xl">
      <ModalContent className="bg-white p-6">
        <h2 className="text-2xl font-bold mb-4">Registrar Nuevo Producto</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Información del Producto</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código (SKU)</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <input
                type="text"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio de Compra *</label>
                <input
                  type="number"
                  step="0.01"
                  name="precioCompra"
                  value={formData.precioCompra}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad de Presentación *</label>
                <input
                  type="number"
                  step="0.01"
                  name="capacidadPresentacion"
                  value={formData.capacidadPresentacion}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select
                  name="fkCategoriaId"
                  value={formData.fkCategoriaId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias.map(categoria => (
                    <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unidad de Medida</label>
                <select
                  name="fkUnidadMedidaId"
                  value={formData.fkUnidadMedidaId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar unidad de medida</option>
                  {unidadesMedida.map(unidad => (
                    <option key={unidad.id} value={unidad.id}>{unidad.nombre}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Imagen del Producto</label>
              <ImageUpload onFileSelect={handleFileSelect} />
            </div>
          </div>

          {/* Lot Inventory Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Información del Lote de Inventario</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bodega *</label>
                <select
                  name="fkBodegaId"
                  value={formData.fkBodegaId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccionar bodega</option>
                  {bodegas.map(bodega => (
                    <option key={bodega.id} value={bodega.id}>{bodega.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                <input
                  type="number"
                  step="0.01"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Vencimiento</label>
              <input
                type="date"
                name="fechaVencimiento"
                value={formData.fechaVencimiento}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}
          <div className="flex justify-end space-x-2">
            <Button onClick={onClose} variant="light">Cancelar</Button>
            <CustomButton
              text={isLoading ? 'Registrando...' : 'Registrar Producto'}
              type="submit"
              disabled={isLoading}
            />
          </div>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default UnifiedProductModal;