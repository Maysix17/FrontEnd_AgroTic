import React, { useState, useEffect } from 'react';
import type { MedicionSensor } from '../../services/zonasService';
import { medicionSensorService } from '../../services/zonasService';
import { useMqttSocket } from '../../hooks/useMqttSocket';
import { Card, CardBody, CardHeader, Button, Spinner, Badge } from '@heroui/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SensorReadingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  zonaId: string;
  zonaNombre: string;
  mqttConfigId?: string;
}

interface SensorData {
  [key: string]: {
    unit: string;
    history: Array<{ value: number; timestamp: string }>;
    lastValue: number;
    lastUpdate: string;
  };
}

const SensorReadingsModal: React.FC<SensorReadingsModalProps> = ({
  isOpen,
  onClose,
  zonaId,
  zonaNombre,
  mqttConfigId,
}) => {
  const [sensorData, setSensorData] = useState<SensorData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [liveUpdates, setLiveUpdates] = useState<MedicionSensor[]>([]);

  // Use MQTT socket hook for real-time updates
  const { getLecturasZona } = useMqttSocket();

  useEffect(() => {
    if (isOpen) {
      loadHistoricalData();
    }
  }, [isOpen, zonaId]);

  // Effect to update sensor data with real-time MQTT readings
  useEffect(() => {
    if (isOpen && zonaId) {
      const lecturas = getLecturasZona(zonaId);
      if (lecturas.length > 0) {
        // Get the latest reading and update sensor data
        const latestLectura = lecturas[0]; // Most recent is first
        setSensorData(prevData => {
          const newData = { ...prevData };
          let hasUpdates = false;

          latestLectura.mediciones.forEach(medicion => {
            const sensorKey = medicion.key;
            const newValue = Number(medicion.valor);

            if (!newData[sensorKey]) {
              newData[sensorKey] = {
                unit: medicion.unidad,
                history: [{ value: newValue, timestamp: medicion.fechaMedicion }], // Initialize with first value
                lastValue: newValue,
                lastUpdate: medicion.fechaMedicion,
              };
              hasUpdates = true;
            } else {
              // Only update if the value or timestamp is different
              const currentLastUpdate = new Date(newData[sensorKey].lastUpdate);
              const newLastUpdate = new Date(medicion.fechaMedicion);

              if (newData[sensorKey].lastValue !== newValue || currentLastUpdate.getTime() !== newLastUpdate.getTime()) {
                newData[sensorKey].lastValue = newValue;
                newData[sensorKey].lastUpdate = medicion.fechaMedicion;

                // Always add to history for continuous chart
                newData[sensorKey].history.push({ value: newValue, timestamp: medicion.fechaMedicion });
                // Keep only last 20 values
                if (newData[sensorKey].history.length > 20) {
                  newData[sensorKey].history = newData[sensorKey].history.slice(-20);
                }
                hasUpdates = true;
              }
            }
          });

          // Only return new data if there were actual updates
          return hasUpdates ? newData : prevData;
        });
      }
    }
  }, [isOpen, zonaId, getLecturasZona]);

  const loadHistoricalData = async () => {
    setIsLoading(true);
    try {
      const mediciones = await medicionSensorService.getByZona(zonaId, 100);
      processMediciones(mediciones);
    } catch (error) {
      console.error('Error loading sensor data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const processMediciones = (mediciones: MedicionSensor[]) => {
    const data: SensorData = {};

    mediciones.forEach(medicion => {
      if (!data[medicion.key]) {
        data[medicion.key] = {
          unit: medicion.unidad,
          history: [],
          lastValue: medicion.valor,
          lastUpdate: medicion.fechaMedicion,
        };
      }

      data[medicion.key].history.push({ value: medicion.valor, timestamp: medicion.fechaMedicion });

      // Keep only last 20 values for sparkline
      if (data[medicion.key].history.length > 20) {
        data[medicion.key].history = data[medicion.key].history.slice(-20);
      }

      // Update if this is more recent
      if (new Date(medicion.fechaMedicion) > new Date(data[medicion.key].lastUpdate)) {
        data[medicion.key].lastValue = medicion.valor;
        data[medicion.key].lastUpdate = medicion.fechaMedicion;
      }
    });

    setSensorData(data);
  };

  // Sensor Card Component
  const SensorCard = React.memo(({ sensorKey, data }: { sensorKey: string; data: SensorData[string] }) => {
    const chartData = data.history.map((point, index) => ({
      time: index,
      value: point.value,
      timestamp: point.timestamp,
    }));

    return (
      <Card className="w-full">
        <CardHeader className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{sensorKey}</h3>
            <p className="text-sm text-gray-500">{data.unit}</p>
          </div>
          <Badge color="success" variant="flat">
            Activo
          </Badge>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {/* Current Value */}
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600">
                {Number(data.lastValue).toFixed(2)}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Última actualización: {new Date(data.lastUpdate).toLocaleString()}
              </div>
            </div>

            {/* Chart */}
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="time"
                    tick={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                  />
                  <Tooltip
                    formatter={(value: number) => [value.toFixed(2), 'Valor']}
                    labelFormatter={(label) => `Lectura ${label + 1}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#16a34a"
                    strokeWidth={2}
                    dot={{ fill: '#16a34a', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#16a34a', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div>
                <div className="font-semibold text-gray-700">Mín</div>
                <div className="text-gray-500">
                  {Math.min(...data.history.map(h => h.value)).toFixed(2)}
                </div>
              </div>
              <div>
                <div className="font-semibold text-gray-700">Prom</div>
                <div className="text-gray-500">
                  {(data.history.reduce((sum, h) => sum + h.value, 0) / data.history.length).toFixed(2)}
                </div>
              </div>
              <div>
                <div className="font-semibold text-gray-700">Máx</div>
                <div className="text-gray-500">
                  {Math.max(...data.history.map(h => h.value)).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-400 text-center">
              {data.history.length} lecturas históricas
            </div>
          </div>
        </CardBody>
      </Card>
    );
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      <div className="absolute inset-0 bg-black bg-opacity-30" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-auto z-10">
        <Card className="w-full">
          <CardHeader className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Lecturas en Tiempo Real - {zonaNombre}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Monitoreo de sensores MQTT en tiempo real
              </p>
            </div>
            <Button
              isIconOnly
              variant="light"
              onPress={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </Button>
          </CardHeader>

          <CardBody>

            {isLoading ? (
              <div className="text-center py-8">
                <Spinner size="lg" color="primary" />
                <p className="mt-2 text-gray-600">Cargando datos...</p>
              </div>
            ) : Object.keys(sensorData).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                No hay lecturas disponibles para esta zona.
                <br />
                <small className="text-gray-400">Las lecturas aparecerán aquí cuando el dispositivo MQTT esté activo.</small>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(sensorData).map(([key, data]) => (
                  <SensorCard key={key} sensorKey={key} data={data} />
                ))}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <Button
                variant="bordered"
                onPress={loadHistoricalData}
                startContent={<Spinner size="sm" />}
                isLoading={isLoading}
              >
                Actualizar
              </Button>
              <Button
                color="primary"
                onPress={onClose}
              >
                Cerrar
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default SensorReadingsModal;