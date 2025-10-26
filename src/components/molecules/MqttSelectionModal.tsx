import React, { useState, useEffect } from 'react';
import { type ZonaMqttConfig, type MqttConfig, mqttConfigService } from '../../services/zonasService';
import CustomButton from '../atoms/Boton';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react';
import { CheckCircleIcon, XCircleIcon, PlayIcon } from '@heroicons/react/24/outline';

interface MqttSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  zonaId: string;
  zonaNombre: string;
  onSave: () => void;
}

const MqttSelectionModal: React.FC<MqttSelectionModalProps> = ({
  isOpen,
  onClose,
  zonaId,
  zonaNombre,
  onSave,
}) => {
  const [mqttConfigs, setMqttConfigs] = useState<MqttConfig[]>([]);
  const [activeZonaMqttConfig, setActiveZonaMqttConfig] = useState<ZonaMqttConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [testingConfig, setTestingConfig] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; message: string; latency?: number }>>({});

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, zonaId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [configsData, activeConfigData] = await Promise.all([
        mqttConfigService.getAll(),
        mqttConfigService.getActiveZonaMqttConfig(zonaId),
      ]);
      setMqttConfigs(configsData);
      setActiveZonaMqttConfig(activeConfigData);
    } catch (error) {
      console.error('Error loading MQTT data:', error);
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async (config: MqttConfig) => {
    setTestingConfig(config.id);
    setTestResults(prev => ({ ...prev, [config.id]: { success: false, message: 'Probando...' } }));

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/mqtt-config/test-connection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          host: config.host,
          port: config.port.toString(),
          protocol: config.protocol,
          topicBase: config.topicBase,
        }),
      });

      const result = await response.json();
      setTestResults(prev => ({ ...prev, [config.id]: result }));
    } catch (error: any) {
      setTestResults(prev => ({
        ...prev,
        [config.id]: {
          success: false,
          message: error.message || 'Error al probar conexión',
        }
      }));
    } finally {
      setTestingConfig(null);
    }
  };

  const handleAssignConfig = async (configId: string) => {
    try {
      await mqttConfigService.assignConfigToZona(zonaId, configId);
      await loadData(); // Reload to show updated state
      onSave();
    } catch (error: any) {
      console.error('Error assigning config:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error al asignar configuración';
      alert(`Error al asignar configuración: ${errorMessage}`);
    }
  };

  const handleUnassignConfig = async (configId: string) => {
    try {
      await mqttConfigService.unassignConfigFromZona(zonaId, configId);
      await loadData(); // Reload to show updated state
      onSave();
    } catch (error) {
      console.error('Error unassigning config:', error);
      alert('Error al desconectar configuración');
    }
  };

  const isConfigActive = (configId: string) => {
    return activeZonaMqttConfig?.mqttConfig?.id === configId;
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="lg">
      <ModalContent>
        <ModalHeader>
          <h2 className="text-lg font-semibold">
            Seleccionar Configuración MQTT
          </h2>
        </ModalHeader>

        <ModalBody>
          <div className="text-sm text-gray-600 mb-4">
            Zona: <strong>{zonaNombre}</strong>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Cargando configuraciones...</p>
            </div>
          ) : mqttConfigs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No hay configuraciones MQTT disponibles</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {mqttConfigs.map((config) => {
                const isActive = isConfigActive(config.id);
                const testResult = testResults[config.id];

                return (
                  <div
                    key={config.id}
                    className={`border rounded-lg p-4 ${
                      isActive ? 'border-green-300 bg-green-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{config.nombre}</h3>
                        <p className="text-sm text-gray-600">
                          {config.protocol}://{config.host}:{config.port} - {config.topicBase}
                        </p>
                      </div>
                      {isActive && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Conectado
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <CustomButton
                        type="button"
                        text={testingConfig === config.id ? 'Probando...' : 'Probar'}
                        onClick={() => testConnection(config)}
                        disabled={testingConfig === config.id}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm"
                      />

                      {testResult && (
                        <div className={`flex items-center gap-1 text-sm px-2 py-1 rounded ${
                          testResult.success
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {testResult.success ? (
                            <CheckCircleIcon className="w-4 h-4" />
                          ) : (
                            <XCircleIcon className="w-4 h-4" />
                          )}
                          <span>{testResult.message}</span>
                          {testResult.latency && (
                            <span className="text-xs ml-1">({testResult.latency}ms)</span>
                          )}
                        </div>
                      )}

                      <div className="ml-auto flex gap-2">
                        {isActive ? (
                          <CustomButton
                            type="button"
                            text="Desconectar"
                            onClick={() => handleUnassignConfig(config.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm"
                          />
                        ) : (
                          <CustomButton
                            type="button"
                            text="Conectar"
                            onClick={() => handleAssignConfig(config.id)}
                            disabled={!testResult?.success}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm disabled:opacity-50"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <CustomButton
            type="button"
            text="Cerrar"
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2"
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MqttSelectionModal;