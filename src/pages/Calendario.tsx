import { useState } from "react";
import DateRangeInput from "../components/atoms/DateRangeInput";

function Calendario() {
  const [range, setRange] = useState<[Date | null, Date | null]>([null, null]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Calendario de Actividad</h1>

      <DateRangeInput 
        label="Selecciona un rango de fechas"
        onChange={setRange}
      />

      {range[0] && range[1] && (
        <p className="mt-3 text-green-500">
          Actividad desde <b>{range[0]?.toLocaleDateString()}</b> hasta <b>{range[1]?.toLocaleDateString()}</b>
        </p>
      )}
    </div>
  );
}

export default Calendario;

