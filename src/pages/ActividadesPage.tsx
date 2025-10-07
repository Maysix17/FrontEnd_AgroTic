import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-datepicker/dist/react-datepicker.css';
import ActividadModal from '../components/organisms/ActividadModal';
import ActivityListModal from '../components/organisms/ActivityListModal';
import ActivityDetailModal from '../components/organisms/ActivityDetailModal';
import FinalizeActivityModal from '../components/organisms/FinalizeActivityModal';
import {
  getActividadesByDateRange,
  getActividadesCountByDate,
  getActividadesByDate,
  createActividad,
  updateActividad,
  deleteActividad,
  uploadActividadEvidence,
  createUsuarioXActividad,
  createInventarioXActividad,
  createMovimiento
} from '../services/actividadesService';
import { getZonaByNombre, getZonaCultivosVariedadXZona } from '../services/cultivosService';

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
  const [activities, setActivities] = useState<any[]>([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [activityCounts, setActivityCounts] = useState<{[key: string]: number}>({});

  useEffect(() => {
    fetchEvents(selectedDate);
  }, [selectedDate]);


  const fetchEvents = async (date: Date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];

    try {
      const activities = await getActividadesByDateRange(startStr, endStr);
      const formattedEvents = activities.map((activity: any) => ({
        id: activity.id,
        title: activity.descripcion || 'Actividad',
        start: new Date(activity.fechaAsignacion),
        end: new Date(activity.fechaAsignacion),
        resource: activity,
      }));
      setEvents(formattedEvents);

      // Fetch activity counts for the month
      const daysInMonth = eachDayOfInterval({ start, end });
      const countsPromises = daysInMonth.map(async (day) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        try {
          const count = await getActividadesCountByDate(dateStr);
          return { dateStr, count };
        } catch {
          return { dateStr, count: 0 };
        }
      });
      const countsArray = await Promise.all(countsPromises);
      const countsObj = countsArray.reduce((acc, curr) => ({ ...acc, [curr.dateStr]: curr.count }), {});
      setActivityCounts(countsObj);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
      setActivityCounts({});
    }
  };

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
          events={[]}
          components={{
            event: () => null,
            showMore: () => null,
            dateCellWrapper: ({ children, value }) => {
              const dateStr = format(value, 'yyyy-MM-dd');
              const count = activityCounts[dateStr] || 0;
              const today = new Date();
              const isToday = format(value, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
              const isOffRange = value.getMonth() !== selectedDate.getMonth();
              return (
                <div
                  className={`relative h-full w-full border border-gray-300 ${isToday ? 'bg-green-100' : ''} ${isOffRange ? 'bg-gray-100 text-gray-400' : ''}`}
                  style={{ minHeight: '80px' }}
                >
                  {children}
                  {count > 0 && (
                    <div className="absolute top-1 left-3 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {count}
                    </div>
                  )}
                </div>
              );
            }
          }}
          onSelectSlot={async (slotInfo) => {
            const dateStr = slotInfo.start.toISOString().split('T')[0];

            try {
              const count = await getActividadesCountByDate(dateStr);

              if (count > 0) {
                // Fetch activities and open list modal
                const activitiesData = await getActividadesByDate(dateStr);
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
            // Find CVZ for the selected lote (zone)
            const zone = await getZonaByNombre(data.lote);
            if (!zone) throw new Error('Zona no encontrada');

            // Find CVZ for the zone
            const cvzs = await getZonaCultivosVariedadXZona(zone.id);
            if (cvzs.length === 0) throw new Error('No hay cultivos en esta zona');

            const actividadData = {
              descripcion: data.descripcion,
              fechaAsignacion: data.fecha,
              horasDedicadas: 8, // default
              observacion: data.descripcion,
              estado: true,
              fkCultivoVariedadZonaId: cvzs[0].cvzId,
              fkCategoriaActividadId: data.categoria,
            };

            const actividad = await createActividad(actividadData);

            // Save users
             for (const userId of data.usuarios) {
               await createUsuarioXActividad({ fkUsuarioId: userId, fkActividadId: actividad.id, fechaAsignacion: data.fecha });
             }

            // Save materials and movements
            console.log('Processing materials:', data.materiales);
            for (const mat of data.materiales) {
               console.log('Processing material:', mat);
               await createInventarioXActividad({ fkInventarioId: mat.id, fkActividadId: actividad.id, cantidadUsada: mat.qty });
               console.log('InventarioXActividad created for:', mat.id);

               // Create movement for reservation or surplus usage
               if (mat.isSurplus) {
                 console.log('Creating surplus movement for:', mat.id, 'quantity:', mat.qty);
                 await createMovimiento({ fkInventarioId: mat.id, stockReservadoSobrante: mat.qty });
                 console.log('Surplus movement created');
               } else {
                 console.log('Creating regular movement for:', mat.id, 'quantity:', mat.qty);
                 await createMovimiento({ fkInventarioId: mat.id, stockReservado: mat.qty });
                 console.log('Regular movement created');
               }
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
          try {
            await updateActividad(id, data);
            alert('Actividad actualizada');
            setIsDetailModalOpen(false);
          } catch (error) {
            console.error('Error updating:', error);
            alert('Error al actualizar');
          }
        }}
        onDelete={async (id) => {
          try {
            await deleteActividad(id);
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
          try {
            let imgUrl = '';
            if (data.evidence) {
              const uploadData = await uploadActividadEvidence(data.evidence);
              imgUrl = uploadData.url;
            }

            // Update actividad with imgUrl and finalize
            await updateActividad(data.activityId, { imgUrl, estado: false }); // finalized

            // Release reservations and create returns/surplus movements
            for (const ixa of selectedActivity.inventario_x_actividades || []) {
              const invId = ixa.inventario.id;
              const usedQty = ixa.cantidadUsada;
              const returnedQty = data.returns[invId] || 0;
              const surplusQty = data.surplus[invId] || 0;

              // Release reservation (negative stockReservado)
              await createMovimiento({ fkInventarioId: invId, stockReservado: -usedQty });

              // Create return movement if any
              if (returnedQty > 0) {
                await createMovimiento({ fkInventarioId: invId, stockDevuelto: returnedQty });
              }

              // Create surplus movement if any
              if (surplusQty > 0) {
                await createMovimiento({ fkInventarioId: invId, stockDevueltoSobrante: surplusQty });
              }

              // Release surplus reservation (negative stockReservadoSobrante)
              // Since surplus is considered used when activity is finalized, release the reservation
              await createMovimiento({ fkInventarioId: invId, stockReservadoSobrante: -usedQty });
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