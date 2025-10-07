import React from "react";
import type { FieldGridProps } from "../../types/FieldGridProps";

const FieldGrid: React.FC<FieldGridProps> = ({ children }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {children}
    </div>
  );
};

export default FieldGrid;
