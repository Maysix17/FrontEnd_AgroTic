import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react';
import CustomButton from '../atoms/Boton';
import type { Cultivo } from '../../types/cultivos.types';
import { getCosechasByCultivo } from '../../services/cosechasService';

interface HarvestSellModalProps {
  isOpen: boolean;
  onClose: () => void;
  cultivo: Cultivo | null;
  onHarvest: () => void;
  onSell: () => void;
  onFinalize: () => void;
}

interface CosechaDisponible {
  id: string;
  fecha?: string;
  cantidad: number;
  unidadMedida: string;
}

const HarvestSellModal: React.FC<HarvestSellModalProps> = ({
  isOpen,
  onClose,
  cultivo,
  onHarvest,
  onSell,
  onFinalize
}) => {
  const [cosechasDisponibles, setCosechasDisponibles] = useState<CosechaDisponible[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && cultivo) {
      loadCosechasDisponibles();
    }
  }, [isOpen, cultivo]);

  const loadCosechasDisponibles = async () => {
    if (!cultivo) return;

    setLoading(true);
    try {
      // TODO: Implementar endpoint para obtener cosechas sin venta
      // Por ahora, simulamos con datos vacíos
      const cosechas = await getCosechasByCultivo(cultivo.cvzid);
      setCosechasDisponibles(cosechas || []);
    } catch (error) {
      console.error('Error loading cosechas:', error);
      setCosechasDisponibles([]);
    } finally {
      setLoading(false);
    }
  };

  if (!cultivo) return null;

  const isPerenne = cultivo.tipoCultivo?.esPerenne || false;
  const hasCosecha = !!cultivo.cosechaid;
  const isFinalizado = cultivo.estado === 0;

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="lg">
      <ModalContent className="bg-white">
        <ModalHeader>
          <h2 className="text-xl font-semibold">Gestión de Cosecha y Venta</h2>
          <p className="text-sm text-gray-600 mt-1">
            {cultivo.nombrecultivo} - {cultivo.lote}
          </p>
        </ModalHeader>

        <ModalBody>
          {/* Información del cultivo */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Tipo:</strong> {isPerenne ? 'Perenne' : 'Transitorio'}
              </div>
              <div>
                <strong>Estado:</strong>
                <span className={`px-2 py-1 rounded text-xs ${
                  isFinalizado ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {isFinalizado ? 'Finalizado' : 'Activo'}
                </span>
              </div>
            </div>
          </div>

          {/* Opciones disponibles */}
          <div className="space-y-3">
            {/* Cosechar */}
            <CustomButton
              label="🌾 Registrar Nueva Cosecha"
              onClick={() => { onHarvest(); onClose(); }}
              disabled={isFinalizado || (!isPerenne && hasCosecha)}
              size="md"
              variant="bordered"
              className="w-full justify-start"
            />
            {isFinalizado && (
              <p className="text-xs text-red-600 ml-2">Cultivo finalizado</p>
            )}
            {!isPerenne && hasCosecha && (
              <p className="text-xs text-orange-600 ml-2">Ya cosechado (transitorio)</p>
            )}

            {/* Vender */}
            <CustomButton
              label="💰 Registrar Venta"
              onClick={() => { onSell(); onClose(); }}
              disabled={isFinalizado || !hasCosecha}
              size="md"
              variant="bordered"
              className="w-full justify-start"
            />
            {!hasCosecha && (
              <p className="text-xs text-orange-600 ml-2">Requiere cosecha previa</p>
            )}

            {/* Finalizar (solo perennes activos) */}
            {isPerenne && !isFinalizado && (
              <CustomButton
                label="🏁 Finalizar Cultivo"
                onClick={() => { onFinalize(); onClose(); }}
                size="md"
                variant="solid"
                color="danger"
                className="w-full justify-start"
              />
            )}
          </div>

          {/* Historial rápido */}
          {isPerenne && (
            <div className="mt-4 p-3 bg-blue-50 rounded">
              <h4 className="font-medium text-blue-900">Historial</h4>
              <p className="text-sm text-blue-800">
                Cosechas registradas: {loading ? 'Cargando...' : cosechasDisponibles.length + (hasCosecha ? 1 : 0)}
              </p>
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <CustomButton onClick={onClose} variant="bordered">
            Cerrar
          </CustomButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default HarvestSellModal;