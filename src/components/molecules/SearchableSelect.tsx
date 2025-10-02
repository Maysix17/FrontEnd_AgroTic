import React, { useState } from 'react';
import SearchInput from '../atoms/InputSearch';
import Tag from '../atoms/Tag';

interface Item {
  id: string;
  name: string;
}

interface SearchableSelectProps {
  label: string;
  options: Item[];
  selected: Item[];
  onSelect: (item: Item) => void;
  onRemove: (item: Item) => void;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({ label, options, selected, onSelect, onRemove }) => {
  const [search, setSearch] = useState('');

  const filtered = options.filter(
    (opt) =>
      opt.name.toLowerCase().includes(search.toLowerCase()) &&
      !selected.some((sel) => sel.id === opt.id)
  );

  return (
    <div className="mb-4">
      <p className="font-semibold mb-2">{label}</p>
      
      {/* Input de búsqueda */}
      <SearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar..."
      />

      {/* 👇 Mostrar resultados SOLO si hay algo escrito */}
      {search.length > 0 && (
        <ul className="border rounded mt-1 max-h-40 overflow-y-auto">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <li
                key={item.id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  onSelect(item);
                  setSearch(''); // limpiar el input tras seleccionar
                }}
              >
                {item.name}
              </li>
            ))
          ) : (
            <li className="p-2 text-gray-400">No hay resultados</li>
          )}
        </ul>
      )}

      {/* Tags de seleccionados */}
      <div className="mt-2 flex flex-wrap">
        {selected.map((item) => (
          <Tag key={item.id} label={item.name} onRemove={() => onRemove(item)} />
        ))}
      </div>
    </div>
  );
};

export default SearchableSelect;

