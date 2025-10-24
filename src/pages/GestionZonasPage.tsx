import React, { useState, useEffect, useCallback } from 'react';
import { zonasService, mqttConfigService, type Zona, type MqttConfig } from '../services/zonasService';
import { useMqttSocket } from '../hooks/useMqttSocket';
import LeafletMap from '../components/molecules/LeafletMap';
import MqttConfigModal from '../components/molecules/MqttConfigModal';
import SensorReadingsModal from '../components/molecules/SensorReadingsModal';
import ZonaModal from '../components/organisms/ZonaModal';
import GenericFiltersPanel from '../components/organisms/GenericFiltersPanel';
import GenericDataTable from '../components/organisms/GenericDataTable';

const GestionZonasPage: React.FC = () => {
   const [zonas, setZonas] = useState<Zona[]>([]);
   const [filteredZonas, setFilteredZonas] = useState<Zona[]>([]);
   const [selectedZona, setSelectedZona] = useState<Zona | null>(null);
   const [filters, setFilters] = useState<Record<string, any>>({});
   const [isLoading, setIsLoading] = useState(true);

  // MQTT related state
  const [mqttConfigs, setMqttConfigs] = useState<MqttConfig[]>([]);
  const [showMqttModal, setShowMqttModal] = useState(false);
  const [selectedMqttConfig, setSelectedMqttConfig] = useState<MqttConfig | undefined>();
  const [showReadingsModal, setShowReadingsModal] = useState(false);

  // Zona creation modal
  const [showZonaModal, setShowZonaModal] = useState(false);

  // WebSocket hook
  const { isConnected, getEstadoZona } = useMqttSocket();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterZonas();
  }, [zonas, filters]);

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
    const searchTerm = filters.buscar || '';
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

  const handleCreateZona = () => {
    setShowZonaModal(true);
  };

  const handleZonaSave = () => {
    loadData(); // Reload zones
    setShowZonaModal(false);
  };

  const getMqttStatus = (zonaId: string) => {
    const estado = getEstadoZona(zonaId);
    if (!estado) return { status: 'Sin configurar', color: 'text-gray-500' };

    return estado.conectado
      ? { status: 'Conectado', color: 'text-green-600' }
      : { status: 'Desconectado', color: 'text-red-600' };
  };

  const handleFilterChange = useCallback((key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleSearch = useCallback(() => {
    // Search is handled automatically by useEffect
  }, []);

  const handleClear = useCallback(() => {
    setFilters({});
  }, []);

  // Filter configuration for GenericFiltersPanel
  const mainFilters = [
    {
      key: 'buscar',
      label: 'Zona',
      type: 'text' as const,
      placeholder: 'Buscar por zona o tipo de lote...'
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
    <div className="flex flex-col w-full bg-gray-50">
      <div className="max-w-7xl" style={{ height: 'calc(0px + 93vh)', overflowY: 'auto' }}>

        {/* Filtros usando el componente genérico */}
        <GenericFiltersPanel
          title="Gestión de Zonas"
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          onClear={handleClear}
          loading={isLoading}
          mainFilters={mainFilters}
          onCreate={handleCreateZona}
        />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Table */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden relative" style={{ height: 'calc(-280px + 90vh)' }}>
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">Resultados</h2>
                </div>
              </div>
              <div className="absolute top-4 right-6">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                  {filteredZonas.length} {filteredZonas.length === 1 ? 'zona' : 'zonas'}
                </span>
              </div>

              {isLoading ? (
                <div className="p-12 text-center">
                  <div className="inline-flex items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
                    <span className="text-gray-600">Cargando zonas...</span>
                  </div>
                </div>
              ) : filteredZonas.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron zonas</h3>
                  <p className="text-gray-500 mb-4">No hay zonas que coincidan con los filtros aplicados.</p>
                  <button
                    onClick={handleClear}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-600 bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Limpiar filtros
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto overflow-y-auto h-full">
                  <table className="w-full">
                    <thead className="bg-gray-50/50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[25%]">
                          Zona
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[25%]">
                          Tipo Lote
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[25%]">
                          Estado MQTT
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[25%]">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {filteredZonas.map((zona, index) => (
                        <tr key={`${zona.id}-${index}`} className="h-14 hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-3 text-sm text-gray-900 font-medium">
                            {zona.nombre}
                          </td>
                          <td className="px-6 py-3 text-sm text-gray-900">
                            {zona.tipoLote}
                          </td>
                          <td className="px-6 py-3 text-sm text-gray-600">
                            <span className={`font-medium ${getMqttStatus(zona.id).color}`}>
                              {getMqttStatus(zona.id).status}
                            </span>
                          </td>
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleMqttConfig(zona)}
                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 whitespace-nowrap"
                              >
                                MQTT
                              </button>
                              <button
                                onClick={() => handleViewReadings(zona)}
                                className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 whitespace-nowrap"
                              >
                                Ver Datos
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden relative" style={{ height: 'calc(-280px + 90vh)' }}>
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">Mapa de Zonas</h2>
                </div>
              </div>
              <div className="w-full h-full rounded overflow-hidden flex items-center justify-center" style={{ height: '75%' }}>
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
                  modalOpen={showMqttModal || showReadingsModal || showZonaModal}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {showZonaModal && (
          <ZonaModal
            isOpen={showZonaModal}
            onClose={() => setShowZonaModal(false)}
            onSave={handleZonaSave}
          />
        )}

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