import React from 'react';
import { VisualField } from './index.ts';
import { Check } from 'lucide-react';

interface FieldSelectionProps {
  selectedFields: VisualField[];
  fields?: VisualField[];
  onFieldSelect: (field: VisualField) => void;
  onFieldDeselect: (field: VisualField) => void;
}

const FieldSelection: React.FC<FieldSelectionProps> = ({
  selectedFields,
  fields,
  onFieldSelect,
  onFieldDeselect
}) => {
  const isFieldSelected = (field: VisualField) => {
    return selectedFields.some(selectedField => selectedField.id === field.id);
  };

  const handleFieldToggle = (field: VisualField) => {
    if (isFieldSelected(field)) {
      onFieldDeselect(field);
    } else {
      onFieldSelect(field);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Выбор полей</h2>

      <div className="space-y-2">
        {(fields ?? []).map(field => (
          <div
            key={field.id}
            className="flex items-center py-2 px-3 hover:bg-blue-50 rounded transition-colors cursor-pointer"
            onClick={() => handleFieldToggle(field)}
          >
            <div className={`w-5 h-5 rounded border ${isFieldSelected(field) ? 'bg-blue-500 border-blue-500' : 'border-gray-300'} flex items-center justify-center mr-3`}>
              {isFieldSelected(field) && <Check className="h-3 w-3 text-white" />}
            </div>
            <div>
              <div className="text-sm text-gray-800">{field.label}</div>
              <div className="text-xs text-gray-500">Тип: {field.type}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ⚠️ Используйте этот компонент внутри FieldSelectionStep
export default FieldSelection;