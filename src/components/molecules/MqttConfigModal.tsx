import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react';
import { type MqttConfig, mqttConfigService } from '../../services/zonasService';
import TextInput from '../atoms/TextInput';
import CustomButton from '../atoms/Boton';

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
  console.log('MqttConfigModal: VITE_API_URL:', import.meta.env.VITE_API_URL);

  const [formData, setFormData] = useState({
    nombre: '',
    host: 'broker.hivemq.com',
    port: '8000',
    protocol: 'ws',
    topicBase: 'sensors/#',
    activa: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'success' | 'error'>('idle');

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
    console.log('🔄 MqttConfigModal: handleSubmit called with event:', e);
    e.preventDefault();
    console.log('🚀 MqttConfigModal: Starting submission process');
    console.log('📋 MqttConfigModal: Current formData:', formData);
    console.log('🆔 MqttConfigModal: ZonaId:', zonaId);
    setIsLoading(true);
    setMessage('');
    setConnectionStatus('idle');

    try {
      const configData = {
        ...formData,
        fkZonaId: zonaId,
      };
      console.log('💾 MqttConfigModal: Config data to save:', configData);

      // Save config first
      let savedConfig;
      if (existingConfig) {
        console.log('🔄 MqttConfigModal: Updating existing config with ID:', existingConfig.id);
        savedConfig = await mqttConfigService.update(existingConfig.id, configData);
        console.log('✅ MqttConfigModal: Update response:', savedConfig);
      } else {
        console.log('🆕 MqttConfigModal: Creating new config');
        savedConfig = await mqttConfigService.create(configData);
        console.log('✅ MqttConfigModal: Create response:', savedConfig);
      }

      // Try to connect
      console.log('🔗 MqttConfigModal: Starting connection attempt');
      setConnectionStatus('connecting');
      const connectUrl = `${import.meta.env.VITE_API_URL}/mqtt/connect/${zonaId}`;
      console.log('🌐 MqttConfigModal: API URL from env:', import.meta.env.VITE_API_URL);
      console.log('🔗 MqttConfigModal: Full connect URL:', connectUrl);
      console.log('📡 MqttConfigModal: Sending POST request to connect');
      const connectResponse = await fetch(connectUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('📡 MqttConfigModal: Fetch completed, response received');
      console.log('📊 MqttConfigModal: Connect response status:', connectResponse.status);
      console.log('✅ MqttConfigModal: Connect response ok:', connectResponse.ok);
      console.log('📋 MqttConfigModal: Connect response headers:', Object.fromEntries(connectResponse.headers.entries()));

      let connectResult;
      try {
        connectResult = await connectResponse.json();
        console.log('📋 MqttConfigModal: Parsed connect result:', connectResult);
      } catch (parseError) {
        console.error('❌ MqttConfigModal: Error parsing JSON response:', parseError);
        console.log('📄 MqttConfigModal: Raw response text:', await connectResponse.text());
        throw new Error('Invalid JSON response from server');
      }

      if (connectResult.success) {
        console.log('🎉 MqttConfigModal: Connection successful - Broker connected');
        setConnectionStatus('success');
        setMessage('¡Conexión exitosa! El broker MQTT está conectado y listo para recibir datos.');
        setTimeout(() => {
          console.log('🔄 MqttConfigModal: Calling onSave and onClose after success');
          onSave();
          onClose();
        }, 2000); // Show success message longer
      } else {
        console.log('❌ MqttConfigModal: Connection failed - Broker not connected');
        console.log('💬 MqttConfigModal: Failure message:', connectResult.message);
        setConnectionStatus('error');
        setMessage(connectResult.message || 'Error al conectar con el broker MQTT. Verifica la configuración del host, puerto y protocolo.');
      }
    } catch (err: any) {
      console.error('💥 MqttConfigModal: Error occurred during process:', err);
      console.error('💬 MqttConfigModal: Error message:', err.message);
      console.error('📚 MqttConfigModal: Error stack:', err.stack);
      setConnectionStatus('error');
      setMessage(err.message || err.response?.data?.message || 'Error al guardar configuración o conectar');
    } finally {
      console.log('🔄 MqttConfigModal: Setting isLoading to false');
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="lg" placement="center">
      <ModalContent>
        {() => (
          <>
            <ModalHeader>
              <h2 className="text-lg font-bold">
                {existingConfig ? 'Editar' : 'Crear'} Configuración MQTT
              </h2>
            </ModalHeader>

            <ModalBody className="max-h-[60vh] overflow-y-auto">
              <div className="mb-4 text-sm text-gray-600">
                Zona: <strong>{zonaNombre}</strong>
              </div>

              {message && <p className="text-center text-red-500 mb-4">{message}</p>}

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <TextInput
                  label="Nombre de Configuración"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <TextInput
                    label="Host"
                    value={formData.host}
                    onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                  />

                  <TextInput
                    label="Puerto"
                    value={formData.port}
                    onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Protocolo
                    </label>
                    <select
                      value={formData.protocol}
                      onChange={(e) => setFormData({ ...formData, protocol: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="ws">WebSocket (ws)</option>
                      <option value="wss">WebSocket Seguro (wss)</option>
                      <option value="mqtt">MQTT (mqtt)</option>
                    </select>
                  </div>

                  <TextInput
                    label="Base del Tópico"
                    value={formData.topicBase}
                    onChange={(e) => setFormData({ ...formData, topicBase: e.target.value })}
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

                {connectionStatus === 'connecting' && (
                  <div className="text-blue-600 text-sm bg-blue-50 p-3 rounded flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                    <div>
                      <div className="font-semibold">Probando conexión...</div>
                      <div className="text-xs">Verificando la configuración con el broker MQTT</div>
                    </div>
                  </div>
                )}

                {connectionStatus === 'success' && (
                  <div className="text-green-600 text-sm bg-green-50 p-3 rounded flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <div className="font-semibold">¡Conexión exitosa!</div>
                      <div className="text-xs">El broker MQTT está conectado y listo para recibir datos de sensores.</div>
                    </div>
                  </div>
                )}

                {connectionStatus === 'error' && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded flex items-start">
                    <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <div className="font-semibold">Error de conexión</div>
                      <div className="text-xs mt-1">Verifica que el host, puerto y protocolo sean correctos. Asegúrate de que el broker MQTT esté accesible.</div>
                    </div>
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
                text={isLoading ? 'Guardando...' : connectionStatus === 'connecting' ? 'Conectando...' : 'Guardar y Conectar'}
                disabled={isLoading || connectionStatus === 'connecting'}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2"
                onClick={() => {
                  console.log('Submit button clicked, triggering form submission');
                  const form = document.querySelector('form');
                  if (form) {
                    form.requestSubmit();
                  }
                }}
              />
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default MqttConfigModal;