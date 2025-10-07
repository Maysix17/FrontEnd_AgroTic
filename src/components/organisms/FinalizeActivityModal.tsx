import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, Button, Input, Textarea } from '@heroui/react';

interface Material {
  id: string;
  nombre: string;
  cantidadUsada: number;
}

interface Activity {
  id: string;
  descripcion: string;
  inventario_x_actividades?: { inventario: { nombre: string; id: string }; cantidadUsada: number }[];
}

interface FinalizeActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: Activity | null;
  onSave: (data: any) => void;
}

const FinalizeActivityModal: React.FC<FinalizeActivityModalProps> = ({ isOpen, onClose, activity, onSave }) => {
  const [returns, setReturns] = useState<{ [key: string]: number }>({});
  const [horas, setHoras] = useState(0);
  const [precioHora, setPrecioHora] = useState('');
  const [observacion, setObservacion] = useState('');
  const [evidence, setEvidence] = useState<File | null>(null);

  const handleSave = () => {
    const data = {
      activityId: activity?.id,
      returns,
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
        <ModalHeader>
          <h2 className="text-xl font-semibold">Finalizar actividad</h2>
          <Button variant="light" onClick={onClose}>✕</Button>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            {/* Dynamic return fields */}
            <div>
              <label className="block text-sm font-medium mb-2">Cantidad devuelta de consumibles:</label>
              <div className="grid grid-cols-2 gap-4">
                {activity.inventario_x_actividades?.map((ixa) => (
                  <div key={ixa.inventario.id} className="space-y-2">
                    <label className="block text-sm">{ixa.inventario.nombre} ({ixa.cantidadUsada})</label>
                    <Input
                      type="number"
                      placeholder="Cantidad devuelta"
                      value={returns[ixa.inventario.id]?.toString() || ''}
                      onChange={(e) => setReturns({ ...returns, [ixa.inventario.id]: Number(e.target.value) })}
                    />
                  </div>
                ))}
              </div>
            </div>

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

            <div>
              <label className="block text-sm font-medium mb-2">Observación (opcional)</label>
              <Textarea
                value={observacion}
                onChange={(e) => setObservacion(e.target.value)}
                placeholder="Anota observaciones..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Subir evidencia</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setEvidence(e.target.files?.[0] || null)}
                className="block w-full"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="light" onClick={onClose}>
                Cancelar
              </Button>
              <Button color="success" onClick={handleSave}>
                Guardar
              </Button>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FinalizeActivityModal;