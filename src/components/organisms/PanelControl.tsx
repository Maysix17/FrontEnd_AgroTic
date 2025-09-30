import React, { useState } from 'react';
import InputSearch from '../atoms/buscador';
import Button from '../atoms/ButtonAccion';
import Table from '../atoms/Table';
import AdminUserForm from './AdminUserForm';
import apiClient from '../../lib/axios/axios';

const PanelControl: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);

  const handleSearch = async () => {
    if (!searchInput.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/usuarios/search/dni/${searchInput}`);
      const data = response.data;
      setResults(Array.isArray(data) ? data.slice(0, 8) : [data]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al buscar usuario');
    } finally {
      setLoading(false);
    }
  };

  const getBadgeClass = (rol: string) => {
    switch (rol) {
      case 'Aprendiz':
        return 'bg-blue-500 text-white';
      case 'Instructor':
        return 'bg-green-500 text-white';
      case 'Pasante':
        return 'bg-yellow-500 text-black';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const headers = ['N. de documento', 'Nombres', 'Apellidos', 'Correo Electrónico', 'Teléfono', 'ID Ficha', 'Rol', 'Acciones'];

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Panel de Control</h1>
        <div className="space-x-2">
          <Button onClick={() => setIsUserFormOpen(true)}>Nuevo Usuario</Button>
         
        </div>
      </div>

      {/* Search */}
      <div className="mb-4 flex gap-2">
        <InputSearch
          placeholder="Buscar por DNI..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button variant="primary" onClick={handleSearch}>Buscar</Button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-4">Cargando...</div>
      ) : error ? (
        <div className="text-center py-4 text-red-500">{error}</div>
      ) : (
        <Table headers={headers}>
          {results.map((user, index) => (
            <tr key={index} className="border-b">
              <td className="px-4 py-2">{user.numero_documento}</td>
              <td className="px-4 py-2">{user.nombres}</td>
              <td className="px-4 py-2">{user.apellidos}</td>
              <td className="px-4 py-2">{user.correo_electronico}</td>
              <td className="px-4 py-2">{user.telefono}</td>
              <td className="px-4 py-2">{user.id_ficha}</td>
              <td className="px-4 py-2">
                <span className={`px-2 py-1 rounded text-sm ${getBadgeClass(user.rol)}`}>
                  {user.rol}
                </span>
              </td>
              <td className="px-4 py-2 space-x-2">
                <Button variant="secondary">Editar</Button>
                <Button variant="secondary">Eliminar</Button>
              </td>
            </tr>
          ))}
        </Table>
      )}

      <AdminUserForm
        isOpen={isUserFormOpen}
        onClose={() => setIsUserFormOpen(false)}
        onUserCreated={() => {
          // Optionally refresh the list or show a message
        }}
      />
    </div>
  );
};

export default PanelControl;