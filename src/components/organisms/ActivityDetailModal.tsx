import React, { useState, useEffect } from 'react';
 import { Modal, ModalContent, ModalHeader, ModalBody, Button, Select, SelectItem, Input, Textarea } from '@heroui/react';

interface Activity {
  id: string;
  descripcion: string;
  categoriaActividad: { nombre: string };
  cultivoVariedadZona: {
    zona: { nombre: string };
    cultivoXVariedad: {
      cultivo: { nombre: string; ficha: { numero: string } };
      variedad: { nombre: string; tipoCultivo: { nombre: string } };
    };
  };
  usuariosAsignados?: { usuario: { dni: number; nombres: string; apellidos: string }; activo: boolean }[];
  inventarioUsado?: { inventario: { nombre: string }; cantidadUsada: number; activo: boolean }[];
}

interface ActivityDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: Activity | null;
  onUpdate: (id: string, data: any) => void;
  onDelete: (id: string) => void;
  onFinalize: (activity: Activity) => void;
}

const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({
  isOpen,
  onClose,
  activity,
  onUpdate,
  onDelete,
  onFinalize,
}) => {
  const [categoria, setCategoria] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (activity) {
      console.log('ActivityDetailModal activity:', activity);
      setCategoria(activity.categoriaActividad.nombre);
      const tipoCultivoName = activity.cultivoVariedadZona?.cultivoXVariedad?.variedad?.tipoCultivo?.nombre || 'Tipo Cultivo';
      const variedadName = activity.cultivoVariedadZona?.cultivoXVariedad?.variedad?.nombre || 'Variedad';
      const zoneName = activity.cultivoVariedadZona?.zona?.nombre || 'Zona';
      setUbicacion(`${tipoCultivoName} - ${variedadName} - ${zoneName}`);
      setDescripcion(activity.descripcion);
    }
  }, [activity]);

  const handleUpdate = () => {
    if (activity) {
      onUpdate(activity.id, { descripcion });
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (activity && confirm('¿Estás seguro de eliminar esta actividad?')) {
      onDelete(activity.id);
      onClose();
    }
  };

  if (!activity) return null;

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="4xl">
      <ModalContent>
        <ModalHeader>
          <h2 className="text-2xl font-semibold">Actividades</h2>
          <Button variant="light" onClick={onClose}>✕</Button>
        </ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Aprendices */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Aprendices Responsables</h3>
              <div className="space-y-2 max-h-40 overflow-auto">
                {activity.usuariosAsignados?.filter(u => u.activo).map((uxa, idx) => (
                  <div key={idx} className="p-2 border rounded">
                    {uxa.usuario.dni} - {uxa.usuario.nombres} {uxa.usuario.apellidos}
                  </div>
                )) || <p className="text-gray-500">No hay aprendices</p>}
              </div>
            </div>

            {/* Insumos */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Insumos / Materiales Apartados</h3>
              <div className="space-y-2 max-h-40 overflow-auto">
                {activity.inventarioUsado?.filter(i => i.activo).map((ixa, idx) => (
                  <div key={idx} className="p-2 border rounded flex justify-between">
                    <span>{ixa.inventario.nombre}</span>
                    <span className="font-semibold">{ixa.cantidadUsada}</span>
                  </div>
                )) || <p className="text-gray-500">No hay insumos</p>}
              </div>
            </div>

            {/* Fichas */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Fichas</h3>
              <div className="space-y-2 max-h-40 overflow-auto">
                <div className="p-2 border rounded">
                  {activity.cultivoVariedadZona?.cultivoXVariedad?.cultivo?.ficha?.numero || 'Sin ficha'}
                </div>
              </div>
            </div>
          </div>

          {/* Form bottom */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Categoria de la actividad</label>
                <div className="p-2 border rounded">{categoria}</div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ubicación del Cultivo</label>
                <div className="p-2 border rounded">{ubicacion}</div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <div className="p-2 border rounded min-h-[80px]">{descripcion}</div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? 'Cancelar' : 'Actualizar'}
                </Button>
                <Button color="danger" onClick={handleDelete}>
                  Eliminar
                </Button>
                <Button color="success" onClick={() => onFinalize(activity)}>
                  Finalizar Actividad
                </Button>
              </div>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ActivityDetailModal;