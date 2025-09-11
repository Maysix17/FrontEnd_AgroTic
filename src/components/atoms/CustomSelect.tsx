// src/components/atoms/CustomSelect.tsx
import { useState } from "react";

export default function CustomSelect() {
  const [value, setValue] = useState("");

  return (
    <div className="w-60">
      <label className="block text-gray-700 text-sm mb-2">
        Valor mínimo
      </label>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full border rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="">Seleccione</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="30">30</option>
      </select>
    </div>
  );
}
