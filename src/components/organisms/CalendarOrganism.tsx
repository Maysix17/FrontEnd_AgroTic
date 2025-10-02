import React, { useState, useCallback } from "react";
import { Calendar, dateFnsLocalizer, Views, View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";

import RegisterActivityModal from "./RegisterActivityModal";

const locales = { es };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

interface Item { id: string; name: string; }

const messages = {
  today: "Hoy",
  previous: "Atrás",
  next: "Siguiente",
  month: "Mes",
  week: "Semana",
  day: "Día",
  agenda: "Agenda",
  date: "Fecha",
  time: "Hora",
  event: "Evento",
  allDay: "Todo el día",
};

const CalendarOrganism: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [slotInfo, setSlotInfo] = useState<any>(null);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>(Views.MONTH);

  const usuarios: Item[] = [
    { id: "1", name: "123456789" },
    { id: "2", name: "987654321" },
  ];

  const insumos: Item[] = [
    { id: "1", name: "Fertilizante A" },
    { id: "2", name: "Semilla B" },
  ];

  const zonas: Item[] = [
    { id: "1", name: "Zona Norte" },
    { id: "2", name: "Zona Sur" },
  ];

  const categorias: Item[] = [
    { id: "1", name: "Riego" },
    { id: "2", name: "Cosecha" },
  ];

  const handleRegister = (data: any) => {
    const newEvent = {
      title: data.descripcion,
      start: slotInfo?.start ? new Date(slotInfo.start) : new Date(),
      end: slotInfo?.end ? new Date(slotInfo.end) : new Date(),
      descripcion: data.descripcion,
      zona: data.nombreZona || "Sin zona",
      categoria: data.categoria || "Sin categoría",
      insumo: data.nombreInventario || "Sin insumo",
      usuario: data.dniUsuario || "Sin usuario",
    };

    setEvents([...events, newEvent]);
    setOpenModal(false);
  };

  const handleNavigate = useCallback((newDate: Date) => setDate(newDate), [setDate]);
  const handleView = useCallback((newView: View) => setView(newView), [setView]);

  const handleSelectSlot = (slot: any) => {
    setSlotInfo(slot);
    setOpenModal(true);
  };

  return (
    <div className="h-[650px] bg-white shadow-lg rounded-xl p-4">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        views={{ month: true, week: true, day: true }}
        date={date}
        view={view}
        onNavigate={handleNavigate}
        onView={handleView}
        selectable={true}
        messages={messages}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={(event) =>
          alert(
            `Evento: ${event.title}\nDescripción: ${event.descripcion}\nZona: ${event.zona}\nCategoría: ${event.categoria}\nInsumo: ${event.insumo}\nUsuario: ${event.usuario}`
          )
        }
      />

      <RegisterActivityModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onRegister={handleRegister}
        usuarios={usuarios}
        insumos={insumos}
        zonas={zonas}
        categorias={categorias}
      />
    </div>
  );
};

export default CalendarOrganism;
