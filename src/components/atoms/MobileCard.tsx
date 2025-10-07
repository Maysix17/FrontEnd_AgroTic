import React from 'react';
import CustomButton from './Boton';
import type { MobileCardProps } from '../../types/MobileCard.types';

const MobileCard: React.FC<MobileCardProps> = ({ fields, actions }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 mb-4 shadow-sm w-full max-w-full overflow-hidden">
      {fields.map((field, index) => (
        <div key={index} className="mb-2 break-words">
          <span className="text-sm font-medium text-gray-600">{field.label}:</span>
          <div className="text-sm text-gray-900 mt-1 break-words">{field.value}</div>
        </div>
      ))}
      {actions.length > 0 && (
        <div className="flex flex-wrap gap-1 sm:gap-2 mt-4 pt-4 border-t border-gray-200 justify-start">
          {actions.map((action, index) => (
            <div key={index} className="flex-1 min-w-0 max-w-full sm:max-w-none">
              <CustomButton
                label={action.label}
                onClick={action.onClick}
                size="sm"
                variant={action.variant || 'solid'}
                className="w-full text-xs px-2 py-1 sm:px-3 sm:py-2"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileCard;