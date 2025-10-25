console.log('MqttConfigModal: Importing MqttConfig and mqttConfigService from zonasService');
import React, { useState, useEffect } from 'react';
import { type MqttConfig, mqttConfigService } from '../../services/zonasService';
import TextInput from '../atoms/TextInput';
import CustomButton from '../atoms/Boton';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react';

interface MqttConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  zonaId: string;
  zonaNombre: string;
  existingConfig?: MqttConfig;
  onSave: () => void;
}
const MqttConfigModal: React.FC<MqttConfigModalProps> = ({
  isOpen,
  onClose,
  zonaId,
  zonaNombre,
  existingConfig,
  onSave,
}) => {
  console.log('MqttConfigModal: Component starting, props:', { isOpen, zonaId, zonaNombre, existingConfig });

  const [formData, setFormData] = useState({
    nombre: '',
    host: 'broker.hivemq.com',
    port: '8000',
    protocol: 'ws',
    topicBase: 'sensors/#',
    activa: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionTestResult, setConnectionTestResult] = useState<{
    success: boolean;
    message: string;
    latency?: number;
  } | null>(null);

  console.log('MqttConfigModal: Rendering with formData:', formData);
  console.log('MqttConfigModal: isOpen:', isOpen, 'isLoading:', isLoading, 'error:', error);
  console.log('MqttConfigModal: connectionTestResult:', connectionTestResult);

  useEffect(() => {
    if (existingConfig) {
      setFormData({
        nombre: existingConfig.nombre,
        host: existingConfig.host,
        port: existingConfig.port,
        protocol: existingConfig.protocol,
        topicBase: existingConfig.topicBase,
        activa: existingConfig.activa,
      });
    } else {
      setFormData({
        nombre: `Config ${zonaNombre}`,
        host: 'broker.hivemq.com',
        port: '8000',
        protocol: 'ws',
        topicBase: 'sensors/#',
        activa: true,
      });
    }
  }, [existingConfig, zonaNombre]);

  const testConnection = async () => {
    console.log('MqttConfigModal: Starting connection test with data:', {
      host: formData.host,
      port: formData.port,
      protocol: formData.protocol,
      topicBase: formData.topicBase,
    });
    setIsTestingConnection(true);
    setConnectionTestResult(null);

    try {
      const response = await fetch('/api/mqtt-config/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          host: formData.host,
          port: formData.port,
          protocol: formData.protocol,
          topicBase: formData.topicBase,
        }),
      });

      const result = await response.json();
      console.log('MqttConfigModal: Connection test result:', result);
      setConnectionTestResult(result);
    } catch (err: any) {
      console.error('MqttConfigModal: Connection test error:', err);
      setConnectionTestResult({
        success: false,
        message: 'Error al probar conexión: ' + err.message,
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('MqttConfigModal: Submitting form with data:', formData);
    setIsLoading(true);
    setError('');

    try {
      const configData = {
        ...formData,
        fkZonaId: zonaId,
      };

      if (existingConfig) {
        console.log('MqttConfigModal: Updating existing config:', existingConfig.id);
        await mqttConfigService.update(existingConfig.id, configData);
      } else {
        console.log('MqttConfigModal: Creating new config');
        await mqttConfigService.create(configData);
      }

      onSave();
      onClose();
    } catch (err: any) {
      console.error('MqttConfigModal: Submit error:', err);
      setError(err.response?.data?.message || 'Error al guardar configuración');
    } finally {
      setIsLoading(false);
    }
  };

  const protocolOptions = [
    { key: 'ws', label: 'WebSocket (ws)' },
    { key: 'wss', label: 'WebSocket Seguro (wss)' },
    { key: 'mqtt', label: 'MQTT (mqtt)' },
  ];

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="md">
      <ModalContent>
        <ModalHeader>
          <h2 className="text-lg font-semibold">
            {existingConfig ? 'Editar' : 'Crear'} Configuración MQTT
          </h2>
        </ModalHeader>

        <ModalBody>
          <div className="text-sm text-gray-600 mb-4">
            Zona: <strong>{zonaNombre}</strong>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <TextInput
              label="Nombre de Configuración"
              placeholder="Ingrese nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-4">
              <TextInput
                label="Host"
                placeholder="ej: broker.hivemq.com"
                value={formData.host}
                onChange={(e) => setFormData({ ...formData, host: e.target.value })}
              />

              <TextInput
                label="Puerto"
                type="number"
                placeholder="ej: 8000"
                value={formData.port}
                onChange={(e) => setFormData({ ...formData, port: e.target.value })}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 text-sm mb-1">Protocolo</label>
              <select
                className="w-full h-9 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.protocol}
                onChange={(e) => setFormData({ ...formData, protocol: e.target.value })}
              >
                {protocolOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <TextInput
              label="Base del Tópico"
              placeholder="ej: sensors/#"
              value={formData.topicBase}
              onChange={(e) => setFormData({ ...formData, topicBase: e.target.value })}
            />

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="activa"
                checked={formData.activa}
                onChange={(e) => setFormData({ ...formData, activa: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="activa" className="text-sm font-medium text-gray-700">
                Configuración Activa
              </label>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-2 rounded-lg border border-red-200">
                {error}
              </div>
            )}
          </form>
        </ModalBody>

        <ModalFooter>
          <CustomButton
            type="button"
            text="Cancelar"
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2"
          />
          <CustomButton
            type="submit"
            text={isLoading ? 'Guardando...' : 'Guardar'}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2"
            disabled={isLoading}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MqttConfigModal;