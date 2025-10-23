import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import GenericFiltersPanel from '../components/organisms/GenericFiltersPanel';
import GenericDataTable from '../components/organisms/GenericDataTable';
import UnifiedProductModal from '../components/organisms/UnifiedProductModal';
import BodegaModal from '../components/organisms/BodegaModal';
import CategoriaModal from '../components/organisms/CategoriaModal';
import { inventoryService } from '../services/inventoryService';
import type { LoteInventario } from '../services/inventoryService';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';
import { Modal, ModalContent } from '@heroui/react';

const InventoryPage: React.FC = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [allItems, setAllItems] = useState<LoteInventario[]>([]);
    const [results, setResults] = useState<LoteInventario[]>([]);
    const [loading, setLoading] = useState(false);
    const [isUnifiedProductModalOpen, setIsUnifiedProductModalOpen] = useState(false);
      const [isImageModalOpen, setIsImageModalOpen] = useState(false);
      const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
      const [selectedItem, setSelectedItem] = useState<LoteInventario | null>(null);
      const [editItem, setEditItem] = useState<LoteInventario | null>(null);
      const [isBodegaModalOpen, setIsBodegaModalOpen] = useState(false);
      const [isCategoriaModalOpen, setIsCategoriaModalOpen] = useState(false);
      const [currentPage, setCurrentPage] = useState(1);

   const limit = 10; // Items per page


  // Fetch all items on mount
  useEffect(() => {
    fetchAllInventory();
  }, []);

  // Filter items based on filters
   useEffect(() => {
     const searchTerm = filters.buscar || '';
     if (searchTerm.trim()) {
      const filtered = allItems.filter(item =>
        item.producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.producto.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setResults(filtered.slice((currentPage - 1) * limit, currentPage * limit));
    } else {
      setResults(allItems.slice((currentPage - 1) * limit, currentPage * limit));
    }
   }, [filters, allItems, currentPage]);

  const fetchAllInventory = async () => {
    console.log('Fetching all inventory');
    setLoading(true);
    try {
      // Fetch all items by setting a high limit
      const response = await inventoryService.getAll(1, 10000);
      console.log('All inventory response:', response);
      setAllItems(response.items);
      setResults(response.items.slice(0, limit));
    } catch (err: unknown) {
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInventory = async (page: number) => {
    console.log('Fetching inventory for page:', page);
    setLoading(true);
    try {
      const response = await inventoryService.getAll(page, limit);
      console.log('Inventory response:', response);
      setResults(response.items);
    } catch (err: unknown) {
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  };



  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await inventoryService.delete(id);
        Swal.fire('Eliminado', 'El inventario ha sido eliminado.', 'success');
        fetchInventory(currentPage);
      } catch {
        Swal.fire('Error', 'No se pudo eliminar el inventario.', 'error');
      }
    }
  };


  // Filter configuration for GenericFiltersPanel
  const mainFilters = [
    {
      key: 'buscar',
      label: 'Producto',
      type: 'text' as const,
      placeholder: 'Buscar por nombre o código...'
    }
  ];

  const handleFilterChange = useCallback((key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleSearch = useCallback(() => {
    // Search is handled automatically by useEffect
  }, []);

  const handleClear = useCallback(() => {
    setFilters({});
  }, []);

  return (
    <div className="flex flex-col w-full bg-gray-50">
      <div className="flex flex-col gap-6" style={{ height: 'calc(0px + 93vh)', overflowY: 'auto' }}>
        {/* Filtros usando el componente genérico */}
        <GenericFiltersPanel
          title="Gestión de Inventario"
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          onClear={handleClear}
          loading={loading}
          mainFilters={mainFilters}
          onCreate={() => setIsUnifiedProductModalOpen(true)}
          onManageActions={[
            { label: 'Gestionar Bodegas', icon: <span>🏢</span>, onClick: () => setIsBodegaModalOpen(true) },
            { label: 'Gestionar Categorías', icon: <span>📂</span>, onClick: () => setIsCategoriaModalOpen(true) },
            { label: 'Historial de Movimientos', icon: <span>📊</span>, onClick: () => navigate('/app/movements') }
          ]}
        />

        {/* Tabla usando el componente genérico */}
        <GenericDataTable
          data={results}
          columns={[
            { key: 'producto.sku', label: 'Código', width: 'w-[10%]' },
            { key: 'producto.nombre', label: 'Producto', width: 'w-[18%]' },
            { key: 'producto.categoria.nombre', label: 'Categoría', width: 'w-[12%]', render: (item) => item.producto.categoria?.nombre || '-' },
            { key: 'bodega.nombre', label: 'Bodega', width: 'w-[12%]', render: (item) => item.bodega?.nombre || '-' },
            { key: 'stock', label: 'Stock', width: 'w-[8%]', render: (item) => item.stock || '0.00' },
            { key: 'stockTotal', label: 'Cant. Total', width: 'w-[12%]', render: (item) => `${item.stockTotal?.toFixed(2) || '0.00'} ${item.unidadAbreviatura || ''}` },
            { key: 'cantidadDisponibleParaReservar', label: 'Disponible', width: 'w-[12%]', render: (item) => `${item.cantidadDisponibleParaReservar?.toFixed(2) || '0.00'} ${item.unidadAbreviatura || ''}` },
            { key: 'cantidadReservada', label: 'Reservado', width: 'w-[10%]', render: (item) => `${item.cantidadReservada?.toFixed(2) || '0.00'} ${item.unidadAbreviatura || ''}` }
          ]}
          loading={loading}
          emptyMessage="No se encontraron productos"
          emptyDescription="No hay productos que coincidan con los filtros aplicados."
          onClearFilters={handleClear}
          countLabel="productos"
          actions={(item) => (
            <>
              <button
                onClick={() => {
                  setSelectedItem(item);
                  setIsDetailsModalOpen(true);
                }}
                className="text-primary-500 hover:text-primary-700"
                title="Ver más"
              >
                <EyeIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setEditItem(item);
                  setIsUnifiedProductModalOpen(true);
                }}
                className="text-blue-500 hover:text-blue-700"
                title="Editar"
              >
                <PencilIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-500 hover:text-red-700"
                title="Eliminar"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </>
          )}
          mobileFields={(item) => [
            { label: 'Código', value: item.producto.sku },
            { label: 'Producto', value: item.producto.nombre },
            { label: 'Categoría', value: item.producto.categoria?.nombre || '-' },
            { label: 'Bodega', value: item.bodega?.nombre || '-' },
            { label: 'Stock', value: `${item.stock?.toFixed(2) || '0.00'} ${item.unidadAbreviatura || ''}` },
            { label: 'Cant. Total', value: `${item.stockTotal?.toFixed(2) || '0.00'} ${item.unidadAbreviatura || ''}` },
            { label: 'Disponible', value: `${item.cantidadDisponibleParaReservar?.toFixed(2) || '0.00'} ${item.unidadAbreviatura || ''}` },
            { label: 'Reservado', value: `${item.cantidadReservada?.toFixed(2) || '0.00'} ${item.unidadAbreviatura || ''}` }
          ]}
          mobileActions={(item) => [
            {
              label: 'Ver más',
              onClick: () => {
                setSelectedItem(item);
                setIsDetailsModalOpen(true);
              },
              size: 'sm' as const,
            },
            {
              label: 'Editar',
              onClick: () => {
                setEditItem(item);
                setIsUnifiedProductModalOpen(true);
              },
              size: 'sm',
            },
            {
              label: 'Eliminar',
              onClick: () => handleDelete(item.id),
              size: 'sm',
            },
          ]}
        />
      </div>

      <UnifiedProductModal
        isOpen={isUnifiedProductModalOpen}
        onClose={() => {
          setIsUnifiedProductModalOpen(false);
          setEditItem(null);
        }}
        onProductCreated={() => {
          fetchAllInventory();
          setCurrentPage(1);
        }}
        editItem={editItem}
      />

      <BodegaModal
        isOpen={isBodegaModalOpen}
        onClose={() => setIsBodegaModalOpen(false)}
      />

      <CategoriaModal
        isOpen={isCategoriaModalOpen}
        onClose={() => setIsCategoriaModalOpen(false)}
      />

      <Modal isOpen={isImageModalOpen} onOpenChange={setIsImageModalOpen} size="2xl">
        <ModalContent className="bg-white p-6">
          <h2 className="text-xl font-bold mb-4">Imagen del Producto</h2>
          {selectedItem?.producto.imgUrl && (
            <img
              src={`${import.meta.env.VITE_API_URL}/uploads/${selectedItem.producto.imgUrl}`}
              alt={selectedItem.producto.nombre}
              className="w-full h-auto max-h-96 object-contain"
            />
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen} size="4xl">
        <ModalContent className="bg-white p-6 max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6">Detalles del Producto</h2>
          {selectedItem && (
            <div className="space-y-6">
              {/* Imagen del producto */}
              <div className="flex justify-center">
                {selectedItem.producto.imgUrl ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/${selectedItem.producto.imgUrl}`}
                    alt={selectedItem.producto.nombre}
                    className="w-full max-w-md h-auto max-h-64 object-contain rounded-lg shadow-md"
                  />
                ) : (
                  <div className="w-full max-w-md h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">Sin imagen</span>
                  </div>
                )}
              </div>

              {/* Información detallada */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Información del Producto</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Descripción:</span> {selectedItem.producto.descripcion || 'No disponible'}</p>
                    <p><span className="font-medium">Precio de Compra:</span> ${parseFloat(selectedItem.producto.precioCompra).toFixed(2)}</p>
                    <p><span className="font-medium">Capacidad de Presentación:</span> {selectedItem.producto.capacidadPresentacion || 'No especificada'}</p>
                    {selectedItem.producto.vidaUtilPromedioPorUsos && (
                      <p><span className="font-medium">Vida Útil Promedio por Usos:</span> {selectedItem.producto.vidaUtilPromedioPorUsos} usos</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Información del Lote</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Fecha de Ingreso:</span> {new Date(selectedItem.fechaIngreso).toLocaleDateString()}</p>
                    <p><span className="font-medium">Fecha de Vencimiento:</span> {selectedItem.fechaVencimiento ? new Date(selectedItem.fechaVencimiento).toLocaleDateString() : 'No especificada'}</p>
                    <p><span className="font-medium">Nombre de Bodega:</span> {selectedItem.bodega.nombre}</p>
                    <p><span className="font-medium">Número de Bodega:</span> {selectedItem.bodega.numero || 'No especificado'}</p>
                  </div>
                </div>
              </div>

              {/* Información de stock */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Información de Stock</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{selectedItem.stock || '0.00'} </p>
                    <p className="text-sm text-gray-600">Stock</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{selectedItem.stockTotal?.toFixed(2) || '0.00'} {selectedItem.unidadAbreviatura || ''}</p>
                    <p className="text-sm text-gray-600">Cantidad Disponible Total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary-600">{selectedItem.cantidadDisponibleParaReservar?.toFixed(2) || '0.00'} {selectedItem.unidadAbreviatura || ''}</p>
                    <p className="text-sm text-gray-600">Disponible para Reservar</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">{selectedItem.cantidadReservada?.toFixed(2) || '0.00'} {selectedItem.unidadAbreviatura || ''}</p>
                    <p className="text-sm text-gray-600">Reservado</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default InventoryPage;