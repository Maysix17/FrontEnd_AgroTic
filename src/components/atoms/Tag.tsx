import React from 'react';

interface TagProps {
  label: string;
  onRemove: () => void;
}

const Tag: React.FC<TagProps> = ({ label, onRemove }) => {
  return (
    <span className="bg-blue-600 text-white px-2 py-1 rounded mr-2 mb-1 inline-flex items-center">
      {label} <button onClick={onRemove} className="ml-1 font-bold">×</button>
    </span>
  );
};

export default Tag;
