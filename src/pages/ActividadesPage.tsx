import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-datepicker/dist/react-datepicker.css';

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
    </div>
  );
};

export default ActividadesPage;