import React, { useState, useEffect } from 'react';
import InputSearch from '../components/atoms/buscador';
import CustomButton from '../components/atoms/Boton';
import Table from '../components/atoms/Table';
import MobileCard from '../components/atoms/MobileCard';
import type { CardField, CardAction } from '../types/MobileCard.types';
import InventoryModal from '../components/organisms/InventoryModal';
import InventoryDetailsModal from '../components/organisms/InventoryDetailsModal';
import { inventoryService } from '../services/inventoryService';
import type { InventoryItem } from '../services/inventoryService';
import { EyeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';

const InventoryPage: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [results, setResults] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isSearchMode, setIsSearchMode] = useState(false);

  const limit = 10;
  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    fetchInventory(currentPage);
  }, [currentPage]);

  const fetchInventory = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await inventoryService.getAll(page, limit);
      setResults(response.items);
      setTotal(response.total);
      setIsSearchMode(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar inventario');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchInput.trim()) {
      fetchInventory(1);
      setCurrentPage(1);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await inventoryService.search(searchInput, 1, limit);
      setResults(response.items);
      setTotal(response.total);
      setCurrentPage(1);
      setIsSearchMode(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al buscar inventario');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleEdit = (item: InventoryItem) => {
    setEditItem(item);
    setIsInventoryModalOpen(true);
    setIsDetailsModalOpen(false);
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
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar el inventario.', 'error');
      }
    }
  };

  const headers = ['Nombre', 'Stock', 'Precio', 'Categoría', 'Bodega', 'Ver más'];

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-2 md:gap-0">
        <h1 className="text-xl md:text-2xl font-bold mb-2 md:mb-0">Gestión de Inventario</h1>
        <div className="flex flex-col md:flex-row gap-2 md:gap-2 w-full md:w-auto items-start md:items-center flex-wrap md:flex-nowrap ml-auto">
          <CustomButton
          label="Registrar Inventario"
          onClick={() => setIsInventoryModalOpen(true)}
          size="sm"
          className="px-2 py-1 md:px-4 md:py-2"/>
      </div>
    </div>


      {/* Search */}
      <div className="mb-4 flex gap-2 items-center">
        <InputSearch
          placeholder="Buscar por nombre..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <CustomButton variant="solid" onClick={handleSearch}>
          Buscar
        </CustomButton>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        {loading ? (
          <div className="text-center py-4">Cargando...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : (
          <>
            <Table headers={headers}>
              {results.map((item, index) => (
                <tr key={item.id || index} className="border-b">
                  <td className="px-4 py-2">{item.nombre}</td>
                  <td className="px-4 py-2">{item.stock}</td>
                  <td className="px-4 py-2">${item.precio}</td>
                  <td className="px-4 py-2">{item.categoria?.nombre || '-'}</td>
                  <td className="px-4 py-2">{item.bodega?.nombre || '-'}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setIsDetailsModalOpen(true);
                      }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </Table>

            {/* Pagination */}
            {total > limit && (
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
                >
                  Anterior
                </button>
                <span>
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden">
        {loading ? (
          <div className="text-center py-4">Cargando...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : results.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No se encontraron resultados.
          </div>
        ) : (
          results.map((item) => {
            const fields: CardField[] = [
              { label: 'Nombre', value: item.nombre },
              { label: 'Stock', value: item.stock },
              { label: 'Precio', value: `$${item.precio}` },
              { label: 'Categoría', value: item.categoria?.nombre || '-' },
              { label: 'Bodega', value: item.bodega?.nombre || '-' },
            ];

            const actions: CardAction[] = [
              {
                label: 'Ver Detalles',
                onClick: () => {
                  setSelectedItem(item);
                  setIsDetailsModalOpen(true);
                },
                variant: 'bordered',
                size: 'sm',
              }
            ];

            return (
              <MobileCard key={item.id} fields={fields} actions={actions} />
            );
          })
        )}
      </div>

      <InventoryModal
        isOpen={isInventoryModalOpen}
        onClose={() => {
          setIsInventoryModalOpen(false);
          setEditItem(null);
        }}
        onInventoryCreated={() => fetchInventory(currentPage)}
        editItem={editItem}
      />

      <InventoryDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        item={selectedItem}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default InventoryPage;
