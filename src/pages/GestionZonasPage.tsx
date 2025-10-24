import React, { useState, useEffect } from 'react';
import { zonasService, mqttConfigService, type Zona, type MqttConfig } from '../services/zonasService';
import { useMqttSocket } from '../hooks/useMqttSocket';
import LeafletMap from '../components/molecules/LeafletMap';
import MqttConfigModal from '../components/molecules/MqttConfigModal';
import SensorReadingsModal from '../components/molecules/SensorReadingsModal';
import InputSearch from '../components/atoms/InputSearch';
import Table from '../components/atoms/Table';

const GestionZonasPage: React.FC = () => {
  const [zonas, setZonas] = useState<Zona[]>([]);
  const [filteredZonas, setFilteredZonas] = useState<Zona[]>([]);
  const [selectedZona, setSelectedZona] = useState<Zona | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // MQTT related state
  const [mqttConfigs, setMqttConfigs] = useState<MqttConfig[]>([]);
  const [showMqttModal, setShowMqttModal] = useState(false);
  const [selectedMqttConfig, setSelectedMqttConfig] = useState<MqttConfig | undefined>();
  const [showReadingsModal, setShowReadingsModal] = useState(false);

  // WebSocket hook
  const { isConnected, getEstadoZona } = useMqttSocket();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterZonas();
  }, [zonas, searchTerm]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [zonasData, configsData] = await Promise.all([
        zonasService.getAll(),
        mqttConfigService.getAll(),
      ]);
      setZonas(zonasData);
      setMqttConfigs(configsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterZonas = () => {
    if (!searchTerm) {
      setFilteredZonas(zonas);
      return;
    }

    const filtered = zonas.filter(zona =>
      zona.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      zona.tipoLote.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredZonas(filtered);
  };

  const handleZonaSelect = (zona: Zona) => {
    setSelectedZona(zona);
  };

  const handleMqttConfig = (zona: Zona) => {
    const config = mqttConfigs.find(c => c.fkZonaId === zona.id);
    setSelectedMqttConfig(config);
    setSelectedZona(zona);
    setShowMqttModal(true);
  };

  const handleViewReadings = (zona: Zona) => {
    setSelectedZona(zona);
    setShowReadingsModal(true);
  };

  const handleMqttSave = () => {
    loadData(); // Reload configs
    setShowMqttModal(false);
  };

  const getMqttStatus = (zonaId: string) => {
    const estado = getEstadoZona(zonaId);
    if (!estado) return { status: 'Sin configurar', color: 'text-gray-500' };

    return estado.conectado
      ? { status: 'Conectado', color: 'text-green-600' }
      : { status: 'Desconectado', color: 'text-red-600' };
  };

  const tableColumns = [
    { key: 'nombre', header: 'Zona', sortable: true },
    { key: 'tipoLote', header: 'Tipo Lote', sortable: true },
    {
      key: 'mqttStatus',
      header: 'Estado MQTT',
      render: (zona: Zona) => {
        const { status, color } = getMqttStatus(zona.id);
        return <span className={`font-medium ${color}`}>{status}</span>;
      }
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (zona: Zona) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleMqttConfig(zona)}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
          >
            MQTT
          </button>
          <button
            onClick={() => handleViewReadings(zona)}
            className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
          >
            Ver Datos
          </button>
        </div>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Zonas</h1>
            <p className="text-gray-600 mt-1">
              Administra zonas agrícolas y configuraciones MQTT
              {!isConnected && (
                <span className="ml-2 text-red-600 font-medium">
                  (WebSocket desconectado)
                </span>
              )}
            </p>
          </div>
          <button
            onClick={() => alert('Funcionalidad de registrar zona pendiente')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            Registrar Zona
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <InputSearch
                placeholder="Buscar por zona o tipo de lote..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select className="px-3 py-2 border rounded-lg">
                <option value="">Todos los tipos</option>
                <option value="campo">Campo</option>
                <option value="invernadero">Invernadero</option>
              </select>
              <select className="px-3 py-2 border rounded-lg">
                <option value="">Estado MQTT</option>
                <option value="conectado">Conectado</option>
                <option value="desconectado">Desconectado</option>
                <option value="sin_config">Sin configurar</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {tableColumns.map(col => (
                        <th key={col.key} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {col.header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredZonas.length === 0 ? (
                      <tr>
                        <td colSpan={tableColumns.length} className="px-4 py-8 text-center text-gray-500">
                          No se encontraron zonas
                        </td>
                      </tr>
                    ) : (
                      filteredZonas.map(zona => (
                        <tr
                          key={zona.id}
                          onClick={() => handleZonaSelect(zona)}
                          className={`cursor-pointer hover:bg-gray-50 ${selectedZona?.id === zona.id ? 'bg-green-50' : ''}`}
                        >
                          {tableColumns.map(col => (
                            <td key={col.key} className="px-4 py-3 whitespace-nowrap">
                              {col.render ? col.render(zona) : zona[col.key as keyof Zona]}
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold mb-4">Mapa de Zonas</h3>
              <div className="h-96 rounded overflow-hidden">
                <LeafletMap
                  zonas={filteredZonas.map(z => ({
                    id: z.id,
                    nombre: z.nombre,
                    coorX: z.coorX,
                    coorY: z.coorY,
                    coordenadas: z.coordenadas,
                  }))}
                  selectedZona={selectedZona ? {
                    id: selectedZona.id,
                    nombre: selectedZona.nombre,
                    coorX: selectedZona.coorX,
                    coorY: selectedZona.coorY,
                    coordenadas: selectedZona.coordenadas,
                  } : undefined}
                  onZonaSelect={(zona) => {
                    const fullZona = zonas.find(z => z.id === zona.id);
                    if (fullZona) handleZonaSelect(fullZona);
                  }}
                  showSatellite={true}
                  modalOpen={showMqttModal || showReadingsModal}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {showMqttModal && selectedZona && (
          <MqttConfigModal
            isOpen={showMqttModal}
            onClose={() => setShowMqttModal(false)}
            zonaId={selectedZona.id}
            zonaNombre={selectedZona.nombre}
            existingConfig={selectedMqttConfig}
            onSave={handleMqttSave}
          />
        )}

        {showReadingsModal && selectedZona && (
          <SensorReadingsModal
            isOpen={showReadingsModal}
            onClose={() => setShowReadingsModal(false)}
            zonaId={selectedZona.id}
            zonaNombre={selectedZona.nombre}
            mqttConfigId={selectedMqttConfig?.id}
          />
        )}
      </div>
    </div>
  );
};

export default GestionZonasPage;