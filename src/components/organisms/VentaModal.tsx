import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react';
import CustomButton from '../atoms/Boton';
import TextInput from '../atoms/TextInput';
import type { CreateVentaDto } from '../../types/venta.types';
import { createVenta } from '../../services/ventaService';
import type { Cultivo } from '../../types/cultivos.types';
import { getCosechasByCultivo } from '../../services/cosechasService';
import type { Cosecha } from '../../types/cosechas.types';
import { finalizeCultivo } from '../../services/cultivosService';

interface VentaModalProps {
  isOpen: boolean;
  onClose: () => void;
  cultivo: Cultivo | null;
  onSuccess: () => void;
}

const VentaModal: React.FC<VentaModalProps> = ({ isOpen, onClose, cultivo, onSuccess }) => {
   const [formData, setFormData] = useState<CreateVentaDto>({
     cantidad: 0,
     fecha: new Date().toISOString().split('T')[0], // Fecha automática del día actual
     fkCosechaId: '', // This needs to be set properly
     precioKilo: 0,
   });

   // Ensure fecha is always a string
   const fechaValue = formData.fecha || '';
   const [loading, setLoading] = useState(false);
   const [cosechasDisponibles, setCosechasDisponibles] = useState<Cosecha[]>([]);
   const [selectedCosechaId, setSelectedCosechaId] = useState<string>('');

   const isPerenne = cultivo?.tipoCultivo?.esPerenne || false;

   useEffect(() => {
     if (isOpen && cultivo && isPerenne) {
       loadCosechasDisponibles();
     }
   }, [isOpen, cultivo]);

   const loadCosechasDisponibles = async () => {
     if (!cultivo) return;

     try {
       const cosechas = await getCosechasByCultivo(cultivo.cvzid);
       setCosechasDisponibles(cosechas || []);
       // Auto-seleccionar la primera cosecha si hay solo una
       if (cosechas && cosechas.length === 1) {
         setSelectedCosechaId(cosechas[0].id);
       }
     } catch (error) {
       console.error('Error loading cosechas:', error);
       setCosechasDisponibles([]);
     }
   };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let cosechaIdToUse = '';

    if (isPerenne) {
      // Para perennes, usar la cosecha seleccionada
      if (!selectedCosechaId) {
        alert('Debe seleccionar una cosecha para registrar la venta');
        return;
      }
      cosechaIdToUse = selectedCosechaId;
    } else {
      // Para transitorios, usar la cosecha actual del cultivo
      if (!cultivo || !cultivo.cosechaid) {
        alert('No se encontró una cosecha para este cultivo');
        return;
      }
      cosechaIdToUse = cultivo.cosechaid;
    }

    setLoading(true);
    try {
      await createVenta({
        ...formData,
        fecha: fechaValue,
        fkCosechaId: cosechaIdToUse,
      });

      // Finalización automática para cultivos transitorios
      if (!isPerenne && cultivo) {
        try {
          await finalizeCultivo(cultivo.id);
          console.log('Cultivo transitorio finalizado automáticamente:', cultivo.id);
        } catch (error) {
          console.error('Error finalizando cultivo transitorio:', error);
          // No bloquear el flujo si falla la finalización
        }
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error creating venta:', error);
      alert('Error al registrar venta: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof CreateVentaDto, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="md">
      <ModalContent className="bg-white p-6">
        <ModalHeader>
          <h2 className="text-xl font-semibold">Registrar Venta</h2>
        </ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <div className="space-y-4">
              {/* Selector de cosecha para perennes */}
              {isPerenne && cosechasDisponibles.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Seleccionar Cosecha
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={selectedCosechaId}
                    onChange={(e) => setSelectedCosechaId(e.target.value)}
                  >
                    <option value="">Seleccionar cosecha...</option>
                    {cosechasDisponibles.map((cosecha) => (
                      <option key={cosecha.id} value={cosecha.id}>
                        {cosecha.fecha ? new Date(cosecha.fecha).toLocaleDateString() : 'Sin fecha'} - {cosecha.cantidad} {cosecha.unidadMedida}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <TextInput
                label="Cantidad"
                type="number"
                value={formData.cantidad.toString()}
                onChange={(e) => handleChange('cantidad', parseFloat(e.target.value))}
              />
              <TextInput
                label="Fecha"
                type="date"
                value={fechaValue}
                onChange={(e) => handleChange('fecha', e.target.value)}
                disabled
              />
              <TextInput
                label="Precio por Kilo"
                type="number"
                value={formData.precioKilo?.toString() || ''}
                onChange={(e) => handleChange('precioKilo', parseFloat(e.target.value))}
              />
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

export default VentaModal;