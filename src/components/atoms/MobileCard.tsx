import React from "react";
import CustomButton from "./Boton";
import type { MobileCardProps } from "../../types/MobileCard.types";

const MobileCard: React.FC<MobileCardProps> = ({ fields, actions = [], className }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 mb-4 ${className || ""}`}>
      <div className="flex flex-col gap-2">
        {fields.map((field, idx) => (
          <div key={idx} className="flex justify-between">
            <span className="font-medium text-gray-700">{field.label}:</span>
            <span className="text-gray-900">{field.value}</span>
          </div>
        ))}
      </div>
      {actions.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {actions.map((action, idx) => (
            <CustomButton
              key={idx}
              label={action.label}
              onClick={action.onClick}
              size={action.size || "md"}
              variant={action.variant || "solid"}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileCard;

