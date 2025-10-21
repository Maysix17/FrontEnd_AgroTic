import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react';
import CustomButton from '../atoms/Boton';
import TextInput from '../atoms/TextInput';
import type { CreateCosechaDto } from '../../types/cosechas.types';
import { createCosecha } from '../../services/cosechasService';

interface CosechaModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvzId: string;
  onSuccess: () => void;
  isPerenne?: boolean;
  cultivo?: any; // Para mostrar información del cultivo
}

const CosechaModal: React.FC<CosechaModalProps> = ({ isOpen, onClose, cvzId, onSuccess, cultivo }) => {
  const [formData, setFormData] = useState<CreateCosechaDto>({
    unidadMedida: 'kg',
    cantidad: 0,
    fecha: '',
    fkCultivosVariedadXZonaId: cvzId,
    cantidad_plantas_cosechadas: undefined,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({ ...prev, fkCultivosVariedadXZonaId: cvzId }));
    }
  }, [isOpen, cvzId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fkCultivosVariedadXZonaId) return;

    // Calcular rendimiento por planta si se proporciona cantidad de plantas cosechadas
    const dataToSend = { ...formData };
    if (formData.cantidad_plantas_cosechadas && formData.cantidad_plantas_cosechadas > 0) {
      dataToSend.rendimiento_por_planta = formData.cantidad / formData.cantidad_plantas_cosechadas;
    }

    setLoading(true);
    try {
      await createCosecha(dataToSend);

      // Nota: No finalizamos automáticamente cultivos perennes después de cosechar
      // Solo se finalizan cuando el usuario presiona el botón "Finalizar Cultivo"
      // Los cultivos transitorios se finalizan automáticamente después de vender

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error creating cosecha:', error);
      alert('Error al registrar cosecha: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof CreateCosechaDto, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="md">
      <ModalContent className="bg-white p-6">
        <ModalHeader>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Registrar Cosecha</h2>
            {cultivo && (
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div><strong>Cultivo:</strong> {cultivo.tipoCultivo?.nombre || 'N/A'} {cultivo.nombrecultivo || 'N/A'}</div>
                  <div><strong>Zona:</strong> {cultivo.lote || 'N/A'}</div>
                </div>
              </div>
            )}
          </div>
        </ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Unidad de Medida</label>
                <select
                  className="w-full border rounded-lg px-3 py-2"
                  value={formData.unidadMedida}
                  onChange={(e) => handleChange('unidadMedida', e.target.value)}
                >
                  <option value="kg">Kilogramos</option>
                  <option value="lb">Libras</option>
                </select>
              </div>
              <TextInput
                label="Cantidad"
                type="number"
                value={formData.cantidad.toString()}
                onChange={(e) => handleChange('cantidad', parseFloat(e.target.value))}
              />
              <TextInput
                label="Fecha"
                type="date"
                value={formData.fecha || ''}
                onChange={(e) => handleChange('fecha', e.target.value)}
              />
              <TextInput
                label="Cantidad de Plantas Cosechadas"
                type="number"
                value={formData.cantidad_plantas_cosechadas?.toString() || ''}
                onChange={(e) => handleChange('cantidad_plantas_cosechadas', parseInt(e.target.value) || undefined)}
                placeholder="Opcional - para calcular rendimiento por planta"
              />
              {formData.cantidad_plantas_cosechadas && formData.cantidad > 0 && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Rendimiento por planta: {(formData.cantidad / formData.cantidad_plantas_cosechadas).toFixed(2)} {formData.unidadMedida}/planta
                  </p>
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <CustomButton type="button" onClick={onClose} variant="bordered">
              Cancelar
            </CustomButton>
            <CustomButton type="submit" disabled={loading}>
              {loading ? 'Registrando...' : 'Registrar'}
            </CustomButton>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default CosechaModal;