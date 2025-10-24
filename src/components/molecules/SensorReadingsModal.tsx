import React, { useState, useEffect } from 'react';
import type { MedicionSensor } from '../../services/zonasService';
import { medicionSensorService } from '../../services/zonasService';
import { useMqttSocket } from '../../hooks/useMqttSocket';

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
    history: number[];
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
                history: [newValue], // Initialize with first value
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
                newData[sensorKey].history.push(newValue);
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

      data[medicion.key].history.push(medicion.valor);

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

  // Mini sparkline component
  const MiniSpark = React.memo(({ values }: { values: number[] }) => {
    if (values.length === 0) return null;

    const nums = values.filter(n => !Number.isNaN(Number(n)));
    if (nums.length === 0) return null;

    // Ensure we have at least 2 points for a meaningful line
    if (nums.length < 2) return null;

    const max = Math.max(...nums);
    const min = Math.min(...nums);
    const range = max - min || 1; // Avoid division by zero
    const w = 200;
    const h = 60;
    const pad = 4;

    const points = nums
      .map((n, i) => {
        const x = (i / (nums.length - 1)) * (w - pad * 2) + pad;
        const y = h - ((n - min) / range) * (h - pad * 2) - pad;
        return `${x},${y}`;
      })
      .join(' ');

    return (
      <div className="mt-4">
        <svg width={w} height={h} className="border rounded bg-gray-50">
          {/* Grid lines for better readability */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Main line */}
          <polyline
            points={points}
            fill="none"
            stroke="#16a34a"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {nums.map((n, i) => {
            const x = (i / (nums.length - 1)) * (w - pad * 2) + pad;
            const y = h - ((n - min) / range) * (h - pad * 2) - pad;
            return (
              <circle
                key={`point-${i}-${n}`} // Unique key to prevent flickering
                cx={x}
                cy={y}
                r="3"
                fill="#16a34a"
                stroke="white"
                strokeWidth="1"
              />
            );
          })}
        </svg>

        {/* Value range indicator */}
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Min: {min.toFixed(1)}</span>
          <span>Max: {max.toFixed(1)}</span>
        </div>
      </div>
    );
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      <div className="absolute inset-0 bg-black bg-opacity-30" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto z-10">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              Lecturas en Tiempo Real - {zonaNombre}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">✕</button>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Cargando datos...</p>
            </div>
          ) : Object.keys(sensorData).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay lecturas disponibles para esta zona.
              <br />
              <small>Las lecturas aparecerán aquí cuando el dispositivo MQTT esté activo.</small>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {Object.entries(sensorData).map(([key, data]) => (
                <div key={key} className="p-6 border rounded-lg bg-white shadow-sm min-h-[200px]">

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold text-green-600">
                          {Number(data.lastValue).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Última actualización: {new Date(data.lastUpdate).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-700">{key}</div>
                        <div className="text-xs text-gray-500">{data.unit}</div>
                      </div>
                    </div>

                    <div className="w-full">
                      <MiniSpark values={data.history} />
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-gray-400">
                    {data.history.length} lecturas históricas
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button
              onClick={loadHistoricalData}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Actualizar
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorReadingsModal;