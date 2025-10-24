console.log('MqttConfigModal: Importing MqttConfig and mqttConfigService from zonasService');
import React, { useState, useEffect } from 'react';
import { type MqttConfig, mqttConfigService } from '../../services/zonasService';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const configData = {
        ...formData,
        fkZonaId: zonaId,
      };

      if (existingConfig) {
        await mqttConfigService.update(existingConfig.id, configData);
      } else {
        await mqttConfigService.create(configData);
      }

      onSave();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar configuración');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      <div className="absolute inset-0 bg-black bg-opacity-30" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md overflow-auto p-6 z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {existingConfig ? 'Editar' : 'Crear'} Configuración MQTT
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="mb-4 text-sm text-gray-600">
          Zona: <strong>{zonaNombre}</strong>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de Configuración
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Host
            </label>
            <input
              type="text"
              value={formData.host}
              onChange={(e) => setFormData({ ...formData, host: e.target.value })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Puerto
            </label>
            <input
              type="text"
              value={formData.port}
              onChange={(e) => setFormData({ ...formData, port: e.target.value })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Protocolo
            </label>
            <select
              value={formData.protocol}
              onChange={(e) => setFormData({ ...formData, protocol: e.target.value })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="ws">WebSocket (ws)</option>
              <option value="wss">WebSocket Seguro (wss)</option>
              <option value="mqtt">MQTT (mqtt)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Base del Tópico
            </label>
            <input
              type="text"
              value={formData.topicBase}
              onChange={(e) => setFormData({ ...formData, topicBase: e.target.value })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="activa"
              checked={formData.activa}
              onChange={(e) => setFormData({ ...formData, activa: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="activa" className="text-sm font-medium text-gray-700">
              Configuración Activa
            </label>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MqttConfigModal;