import React from "react";
import type { InputSearchProps } from "../../types/Buscadors.type";

const InputSearch: React.FC<InputSearchProps> = ({ placeholder, value, onChange }) => {
    return (
        <input
            type="text"
            placeholder={placeholder || "Buscar..."}
            value={value}
            onChange={onChange}
            className="w-full px-4 py-2 rounded-2xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
    );
};

export default InputSearch;
    