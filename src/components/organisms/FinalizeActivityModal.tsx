import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, Button, Input, Textarea } from '@heroui/react';

const styles = `
  body {
    background-color: #f0f0f0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 0;
    font-family: Arial, sans-serif;
    padding: 20px;
  }

  .modal-content {
    background-color: white;
    padding: 30px;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    width: 100%;
    border: 1px solid #ddd;
  }

  h1 {
    text-align: center;
    margin-bottom: 25px;
    font-size: 24px;
    font-weight: bold;
    color: #333;
  }

  h3 {
    font-size: 18px;
    font-weight: bold;
    color: #555;
    margin-bottom: 10px;
  }

  .section {
    margin-bottom: 20px;
    border: none;
    box-shadow: none;
  }

  .activity-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .form-group-pair {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    border: none;
    box-shadow: none;
    background: transparent;
  }

  .form-group.full-width {
    /* Ocupa el ancho completo */
  }

  label {
    margin-bottom: 5px;
    font-size: 14px;
    color: #555;
  }

  input[type="number"],
  input[type="text"],
  textarea {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.3s;
    background-color: #fff;
    width: 100%;
    box-sizing: border-box;
  }

  input:focus,
  textarea:focus {
    border-color: #6a6a6a;
    outline: none;
  }

  input, textarea {
    background-color: white !important;
  }

  input[readonly] {
    background-color: #f7f7f7;
    color: #777;
  }

  textarea {
    resize: vertical;
    min-height: 80px;
  }

  .file-upload-box {
    border: 2px dashed #ccc;
    border-radius: 12px;
    padding: 30px 20px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.3s, background-color 0.3s;
    position: relative;
    overflow: hidden;
    background-color: #f9f9f9;
  }

  .file-upload-box:hover {
    border-color: #999;
    background-color: #f0f0f0;
  }

  .file-upload-box p {
    margin-top: 10px;
    color: #777;
    font-size: 14px;
  }

  .upload-icon {
    width: 40px;
    height: 40px;
    color: #a0a0a0;
    margin-top: 5px;
  }

  .button-container {
    display: flex;
    justify-content: flex-end;
    padding-top: 15px;
    grid-column: span 2;
  }

  .save-button {
    background-color: #4CAF50;
    color: white;
    padding: 10px 30px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    transition: background-color 0.3s, transform 0.1s;
  }

  .save-button:hover {
    background-color: #45a049;
  }

  .save-button:active {
    transform: scale(0.98);
  }

  @media (max-width: 480px) {
    .modal-content {
      padding: 20px;
      margin: 10px;
    }

    .form-group-pair {
      grid-template-columns: 1fr;
    }

    .form-group.full-width {
      /* Ya es full width */
    }

    .button-container {
      justify-content: center;
      grid-column: span 1;
    }
  }
`;

interface Activity {
  id: string;
  descripcion: string;
  inventarioUsado?: { inventario: { nombre: string; id: string; categoria: { nombre: string } }; cantidadUsada: number; activo: boolean }[];
  usuariosAsignados?: { usuario: { nombres: string; apellidos: string; id: string }; activo: boolean }[];
}

interface FinalizeActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: Activity | null;
  onSave: (data: any) => void;
}

const FinalizeActivityModal: React.FC<FinalizeActivityModalProps> = ({ isOpen, onClose, activity, onSave }) => {
  const [returns, setReturns] = useState<{ [key: string]: number }>({});
  const [surplus, setSurplus] = useState<{ [key: string]: number }>({});
  const [horas, setHoras] = useState(0);
  const [precioHora, setPrecioHora] = useState(''); // No default
  const [observacion, setObservacion] = useState('');
  const [evidence, setEvidence] = useState<File | null>(null);

  useEffect(() => {
    if (isOpen && activity) {
      // Reset states
      setReturns({});
      setSurplus({});
      setHoras(0);
      setPrecioHora('');
      setObservacion('');
      setEvidence(null);
    }
  }, [isOpen, activity]);

  const handleSave = () => {
    const data = {
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

  // Filter active assignments
  const activeInsumos = activity.inventarioUsado?.filter(i => i.activo && i.inventario?.categoria?.nombre !== 'Herramientas') || [];
  const activeHerramientas = activity.inventarioUsado?.filter(i => i.activo && i.inventario?.categoria?.nombre === 'Herramientas') || [];

  return (
    <>
      <style>{styles}</style>
      <Modal isOpen={isOpen} onOpenChange={onClose} size="4xl">
        <ModalContent className="modal-content">
        <ModalHeader>
          <h1 className="text-2xl font-bold text-center">Finalizar actividad</h1>
          <Button isIconOnly variant="light" onClick={onClose}>
            ✕
          </Button>
        </ModalHeader>
        <ModalBody>
          <form className="activity-form">
            {/* Cantidad sobrante devuelta (Insumos) */}
            <div className="section">
              <h3>Cantidad sobrante devuelta</h3>
              <div className="sobrantes-container">
                <div className="form-group-pair">
                  {activeInsumos.map((ixa) => (
                    <div key={ixa.inventario.id} className="form-group">
                      <label htmlFor={`return-${ixa.inventario.id}`}>{ixa.inventario.nombre}:</label>
                      <Input
                        id={`return-${ixa.inventario.id}`}
                        type="number"
                        value={returns[ixa.inventario.id]?.toString() || ''}
                        onChange={(e) => setReturns({ ...returns, [ixa.inventario.id]: Number(e.target.value) })}
                        min="0"
                        max={ixa.cantidadUsada}
                        className="border-gray-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Herramientas devueltas */}
            <div className="section">
              <h3>Herramientas devueltas</h3>
              <div className="herramientas-container">
                <div className="form-group-pair">
                  {activeHerramientas.map((ixa) => (
                    <div key={ixa.inventario.id} className="form-group">
                      <label htmlFor={`surplus-${ixa.inventario.id}`}>{ixa.inventario.nombre}:</label>
                      <Input
                        id={`surplus-${ixa.inventario.id}`}
                        type="number"
                        value={surplus[ixa.inventario.id]?.toString() || ''}
                        onChange={(e) => setSurplus({ ...surplus, [ixa.inventario.id]: Number(e.target.value) })}
                        min="0"
                        className="border-gray-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Horas y Precio */}
            <div className="form-group-pair">
              <div className="form-group">
                <label htmlFor="horas">Horas dedicadas:</label>
                <Input
                  id="horas"
                  type="number"
                  value={horas.toString()}
                  onChange={(e) => setHoras(Number(e.target.value))}
                  className="border-gray-300"
                />
              </div>
              <div className="form-group">
                <label htmlFor="precio">Precio por hora:</label>
                <Input
                  id="precio"
                  value={precioHora}
                  onChange={(e) => setPrecioHora(e.target.value)}
                  className="border-gray-300"
                />
              </div>
            </div>

            {/* Observación */}
            <div className="form-group full-width">
              <label htmlFor="observacion">Observación: (opcional)</label>
              <Textarea
                id="observacion"
                value={observacion}
                onChange={(e) => setObservacion(e.target.value)}
              />
            </div>

            {/* Evidencia */}
            <div className="form-group full-width">
              <label htmlFor="evidencia">Subir evidencia:</label>
              <Input
                id="evidencia"
                type="file"
                accept="image/*"
                onChange={(e) => setEvidence(e.target.files?.[0] || null)}
                className="border-gray-300"
              />
            </div>

            {/* Botón */}
            <div className="button-container">
              <Button type="button" className="save-button" onClick={handleSave}>
                Guardar
              </Button>
            </div>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
    </>
  );
};

export default FinalizeActivityModal;