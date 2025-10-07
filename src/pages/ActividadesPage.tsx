import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-datepicker/dist/react-datepicker.css';
import ActividadModal from '../components/organisms/ActividadModal';
import ActivityListModal from '../components/organisms/ActivityListModal';
import ActivityDetailModal from '../components/organisms/ActivityDetailModal';
import FinalizeActivityModal from '../components/organisms/FinalizeActivityModal';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: {
    'es': es,
  },
});

const ActividadesPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState(new Date());
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [activities, setActivities] = useState([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 h-full overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center flex-shrink-0">
        <h1 className="text-2xl font-bold">Gestión de Actividades</h1>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Seleccionar Mes:</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date || new Date())}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            className="border border-gray-300 rounded-lg p-2 text-sm"
          />
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white p-4 rounded-lg shadow-md flex-1 overflow-hidden">
        <Calendar
          localizer={localizer}
          culture="es"
          views={['month']}
          defaultView="month"
          date={selectedDate}
          onNavigate={(date) => setSelectedDate(date)}
          onSelectSlot={async (slotInfo) => {
            const dateStr = slotInfo.start.toISOString().split('T')[0];
            const token = localStorage.getItem('token');
            const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

            try {
              const countResponse = await fetch(`http://localhost:3000/actividades/count-by-date/${dateStr}`, { headers });
              const count = await countResponse.json();

              if (count > 0) {
                // Fetch activities and open list modal
                const activitiesResponse = await fetch(`http://localhost:3000/actividades/by-date/${dateStr}`, { headers });
                const activitiesData = await activitiesResponse.json();
                setActivities(activitiesData);
                setIsListModalOpen(true);
              } else {
                // Open create modal
                setModalDate(slotInfo.start);
                setIsModalOpen(true);
              }
            } catch (error) {
              console.error('Error checking activities:', error);
              // Fallback to create modal
              setModalDate(slotInfo.start);
              setIsModalOpen(true);
            }
          }}
          selectable
          style={{ height: '100%' }}
          messages={{
            allDay: 'Todo el día',
            previous: 'Anterior',
            next: 'Siguiente',
            today: 'Hoy',
            month: 'Mes',
            agenda: 'Agenda',
            date: 'Fecha',
            time: 'Hora',
            event: 'Evento',
            noEventsInRange: 'No hay eventos en este rango.',
            showMore: (total: number) => `+ Ver ${total} más`,
          }}
        />
      </div>

      <ActividadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={modalDate}
        onSave={async (data) => {
          try {
            const getAuthHeaders = (): Record<string, string> => {
              const token = localStorage.getItem('token');
              return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
            };

            // Find CVZ for the selected lote (zone)
            const zonesResponse = await fetch(`http://localhost:3000/zonas?nombre=${data.lote}`, {
              headers: getAuthHeaders(),
            });
            const zones = await zonesResponse.json();
            if (zones.length === 0) throw new Error('Zona no encontrada');
            const zoneId = zones[0].id;

            // Find CVZ for the zone
            const cvzResponse = await fetch(`http://localhost:3000/zonas/${zoneId}/cultivos-variedad-zona`, {
              headers: getAuthHeaders(),
            });
            const cvzs = await cvzResponse.json();
            if (cvzs.length === 0) throw new Error('No hay cultivos en esta zona');

            const actividadData = {
              descripcion: data.descripcion,
              fechaAsignacion: data.fecha,
              horasDedicadas: 8, // default
              observacion: data.descripcion,
              estado: true,
              fkCultivoVariedadZonaId: cvzs[0].id,
              fkCategoriaActividadId: data.categoria,
            };

            const response = await fetch('http://localhost:3000/actividades', {
              method: 'POST',
              headers: getAuthHeaders(),
              body: JSON.stringify(actividadData),
            });
            const actividad = await response.json();

            // Save users
            for (const userId of data.usuarios) {
              await fetch('http://localhost:3000/usuarios-x-actividades', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ fkUsuarioId: userId, fkActividadId: actividad.id }),
              });
            }

            // Save materials and movements
            for (const mat of data.materiales) {
              await fetch('http://localhost:3000/inventario-x-actividades', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ fkInventarioId: mat.id, fkActividadId: actividad.id, cantidadUsada: mat.qty }),
              });

              // Create movement for reservation
              await fetch('http://localhost:3000/movimientos', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ fkInventarioId: mat.id, stockReservado: mat.qty }),
              });
            }

            alert('Actividad guardada exitosamente');
          } catch (error) {
            console.error('Error saving actividad:', error);
            alert('Error al guardar la actividad');
          }
        }}
      />

      <ActivityListModal
        isOpen={isListModalOpen}
        onClose={() => setIsListModalOpen(false)}
        activities={activities}
        onSelectActivity={(activity) => {
          setSelectedActivity(activity);
          setIsDetailModalOpen(true);
          setIsListModalOpen(false);
        }}
        onRegisterNew={() => {
          setModalDate(new Date()); // or from the date
          setIsModalOpen(true);
          setIsListModalOpen(false);
        }}
      />

      <ActivityDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        activity={selectedActivity}
        onUpdate={async (id, data) => {
          const token = localStorage.getItem('token');
          const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
          try {
            await fetch(`http://localhost:3000/actividades/${id}`, {
              method: 'PATCH',
              headers,
              body: JSON.stringify(data),
            });
            alert('Actividad actualizada');
            setIsDetailModalOpen(false);
          } catch (error) {
            console.error('Error updating:', error);
            alert('Error al actualizar');
          }
        }}
        onDelete={async (id) => {
          const token = localStorage.getItem('token');
          const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
          try {
            await fetch(`http://localhost:3000/actividades/${id}`, {
              method: 'DELETE',
              headers,
            });
            alert('Actividad eliminada');
            setIsDetailModalOpen(false);
          } catch (error) {
            console.error('Error deleting:', error);
            alert('Error al eliminar');
          }
        }}
        onFinalize={(activity) => {
          setSelectedActivity(activity);
          setIsFinalizeModalOpen(true);
          setIsDetailModalOpen(false);
        }}
      />

      <FinalizeActivityModal
        isOpen={isFinalizeModalOpen}
        onClose={() => setIsFinalizeModalOpen(false)}
        activity={selectedActivity}
        onSave={async (data) => {
          const token = localStorage.getItem('token');
          const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };

          try {
            let imgUrl = '';
            if (data.evidence) {
              const formData = new FormData();
              formData.append('file', data.evidence);
              const uploadResponse = await fetch('http://localhost:3000/actividades/upload', {
                method: 'POST',
                headers: token ? { Authorization: `Bearer ${token}` } : {},
                body: formData,
              });
              const uploadData = await uploadResponse.json();
              imgUrl = uploadData.url;
            }

            // Update actividad with imgUrl and finalize
            await fetch(`http://localhost:3000/actividades/${data.activityId}`, {
              method: 'PATCH',
              headers,
              body: JSON.stringify({ imgUrl, estado: false }), // finalized
            });

            // Create movements for returns
            for (const [invId, qty] of Object.entries(data.returns)) {
              if ((qty as number) > 0) {
                await fetch('http://localhost:3000/movimientos', {
                  method: 'POST',
                  headers,
                  body: JSON.stringify({ fkInventarioId: invId, stockDevuelto: qty }),
                });
              }
            }

            alert('Actividad finalizada');
            setIsFinalizeModalOpen(false);
          } catch (error) {
            console.error('Error finalizing:', error);
            alert('Error al finalizar');
          }
        }}
      />
    </div>
  );
};

export default ActividadesPage;