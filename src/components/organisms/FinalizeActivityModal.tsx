import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, Button, Input, Textarea } from '@heroui/react';
import type { FinalizeActivityModalProps, FinalizeActivityData } from '../../types/finalizeActivityModal.types';

const FinalizeActivityModal: React.FC<FinalizeActivityModalProps> = ({ isOpen, onClose, activity, onSave }) => {
  const [returns, setReturns] = useState<Record<string, number>>({});
  const [surplus, setSurplus] = useState<Record<string, number>>({});
  const [horas, setHoras] = useState(0);
  const [precioHora, setPrecioHora] = useState('');
  const [observacion, setObservacion] = useState('');
  const [evidence, setEvidence] = useState<File | null>(null);

  const handleSave = () => {
    const data: FinalizeActivityData = {
      activityId: activity?.id,
      returns,
      surplus,
      horas,
      precioHora,
      observacion,
      evidence,
    };
    onSave(data);
    onClose();
  };

  if (!activity) return null;

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="3xl">
      <ModalContent>
        <ModalHeader className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Finalizar actividad</h2>
          <Button variant="light" onClick={onClose}>✕</Button>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            {/* Devueltas */}
            <div>
              <label className="block text-sm font-medium mb-2">Cantidad devuelta de consumibles:</label>
              <div className="grid grid-cols-2 gap-4">
                {activity.inventario_x_actividades?.map((ixa) => (
                  <div key={ixa.inventario.id} className="space-y-2">
                    <label className="block text-sm">
                      {ixa.inventario.nombre} (usado: {ixa.cantidadUsada})
                    </label>
                    <Input
                      type="number"
                      placeholder="Cantidad devuelta"
                      value={returns[ixa.inventario.id]?.toString() || ''}
                      onChange={(e) => setReturns({ ...returns, [ixa.inventario.id]: Number(e.target.value) })}
                      min={0}
                      max={ixa.cantidadUsada}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Stock sobrante */}
            <div>
              <label className="block text-sm font-medium mb-2">Stock sobrante encontrado:</label>
              <div className="grid grid-cols-2 gap-4">
                {activity.inventario_x_actividades?.map((ixa) => (
                  <div key={ixa.inventario.id} className="space-y-2">
                    <label className="block text-sm">{ixa.inventario.nombre}</label>
                    <Input
                      type="number"
                      placeholder="Stock sobrante"
                      value={surplus[ixa.inventario.id]?.toString() || ''}
                      onChange={(e) => setSurplus({ ...surplus, [ixa.inventario.id]: Number(e.target.value) })}
                      min={0}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Horas y precio */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Horas dedicadas</label>
                <Input
                  type="number"
                  value={horas.toString()}
                  onChange={(e) => setHoras(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Precio por hora</label>
                <Input
                  value={precioHora}
                  onChange={(e) => setPrecioHora(e.target.value)}
                />
              </div>
            </div>

            {/* Observación */}
            <div>
              <label className="block text-sm font-medium mb-2">Observación (opcional)</label>
              <Textarea
                value={observacion}
                onChange={(e) => setObservacion(e.target.value)}
                placeholder="Anota observaciones..."
              />
            </div>

            {/* Evidencia */}
            <div>
              <label className="block text-sm font-medium mb-2">Subir evidencia</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setEvidence(e.target.files?.[0] || null)}
                className="block w-full"
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-2">
              <Button variant="light" onClick={onClose}>Cancelar</Button>
              <Button color="success" onClick={handleSave}>Guardar</Button>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FinalizeActivityModal;
