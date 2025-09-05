import React from "react";
import type { InputSearchProps } from "../../types/InputSearchProps";

const InputSearch: React.FC<InputSearchProps> = ({ value, onChange, placeholder }) => {
  return (
    <input
      type="text"
      placeholder={placeholder || "Buscar..."}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

export default InputSearch;
