import React, { useState } from 'react';
import { Filter, VisualField, OperatorOption } from './index.ts';
import { getOperatorsForFieldType, fieldMappings } from './fieldMappings';
import { Plus, X, FilterIcon } from 'lucide-react';

interface FilterBuilderProps {
  filters: Filter[];
  onAddFilter: (filter: Filter) => void;
  onRemoveFilter: (filterId: string) => void;
  onUpdateFilter: (filter: Filter) => void;
}

const FilterBuilder: React.FC<FilterBuilderProps> = ({
  filters,
  onAddFilter,
  onRemoveFilter
                                                     }) => {
  const [selectedField, setSelectedField] = useState<VisualField | null>(null);
  const [selectedOperator, setSelectedOperator] = useState<OperatorOption | null>(null);
  const [filterValue, setFilterValue] = useState<string>('');
  const [multipleValues, setMultipleValues] = useState<string[]>([]);

  const resetForm = () => {
    setSelectedField(null);
    setSelectedOperator(null);
    setFilterValue('');
    setMultipleValues([]);
  };

  const handleAddFilter = () => {
    if (selectedField && selectedOperator) {
      const value = selectedOperator.multiple ? multipleValues : filterValue;
      const newFilter: Filter = {
        id: Date.now().toString(),
        field: selectedField,
        operator: selectedOperator.value,
        value: value
      };
      onAddFilter(newFilter);
      resetForm();
    }
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const fieldId = e.target.value;
    const field = fieldMappings.find(f => f.id === fieldId) || null;
    setSelectedField(field);
    setSelectedOperator(null);
  };

  const handleOperatorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const operatorValue = e.target.value;
    const operators = getOperatorsForFieldType(selectedField?.type || 'string');
    const operator = operators.find(op => op.value === operatorValue) || null;
    setSelectedOperator(operator);
    if (operator?.multiple) setMultipleValues([]);
    else setFilterValue('');
  };

  const handleAddMultipleValue = () => {
    if (filterValue && !multipleValues.includes(filterValue)) {
      setMultipleValues([...multipleValues, filterValue]);
      setFilterValue('');
    }
  };

  const handleRemoveMultipleValue = (valueToRemove: string) => {
    setMultipleValues(multipleValues.filter(value => value !== valueToRemove));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
        <FilterIcon className="h-5 w-5 mr-2 text-purple-500" />
        Фильтры
      </h2>

      <div className="mb-4 p-4 border border-gray-200 rounded-md bg-gray-50 w-full max-w-full">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[160px]">
            <label htmlFor="field-select" className="block text-sm font-medium text-gray-700 mb-1">
              Поле
            </label>
            <select
              id="field-select"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              value={selectedField?.id || ''}
              onChange={handleFieldChange}
            >
              <option value="">Выберите поле</option>
              {fieldMappings.map(field => (
                <option key={field.id} value={field.id}>
                  {field.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[160px]">
            <label htmlFor="operator-select" className="block text-sm font-medium text-gray-700 mb-1">
              Оператор
            </label>
            <select
              id="operator-select"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              value={selectedOperator?.value || ''}
              onChange={handleOperatorChange}
              disabled={!selectedField}
            >
              <option value="">Выберите оператор</option>
              {selectedField && getOperatorsForFieldType(selectedField.type).map(op => (
                <option key={op.value} value={op.value}>
                  {op.label}
                </option>
              ))}
            </select>
          </div>

          {selectedOperator?.needsValue && (
            <div>
              <label htmlFor="value-input" className="block text-sm font-medium text-gray-700 mb-1">
                Значение
              </label>
              <div className="flex">
                <input
                  id="value-input"
                  type={selectedField?.type === 'number' ? 'number' : selectedField?.type === 'date' ? 'date' : 'text'}
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  placeholder="Введите значение"
                />
                {selectedOperator?.multiple && (
                  <button
                    type="button"
                    className="ml-2 p-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
                    onClick={handleAddMultipleValue}
                    disabled={!filterValue}
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {selectedOperator?.multiple && multipleValues.length > 0 && (
          <div className="mt-3">
            <p className="text-sm font-medium text-gray-700 mb-1">Значения в списке:</p>
            <div className="flex flex-wrap gap-2">
              {multipleValues.map((value, index) => (
                <div key={index} className="flex items-center bg-purple-100 text-purple-800 px-2 py-1 rounded-md">
                  <span className="mr-1">{value}</span>
                  <button
                    type="button"
                    className="text-purple-800 hover:text-purple-900"
                    onClick={() => handleRemoveMultipleValue(value)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleAddFilter}
            disabled={!selectedField || !selectedOperator || (selectedOperator.needsValue && (!filterValue && !multipleValues.length))}
          >
            Добавить фильтр
          </button>
        </div>
      </div>

      {filters.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Активные фильтры:</h3>
          <div className="space-y-2">
            {filters.map(filter => (
              <div key={filter.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-md">
                <div className="flex-1">
                  <span className="font-medium text-gray-800">{filter.field.label}</span>
                  <span className="mx-2 text-gray-500">{filter.operator}</span>
                  <span className="text-gray-800">
                    {Array.isArray(filter.value) ? filter.value.join(', ') : filter.value.toString()}
                  </span>
                </div>
                <button
                  type="button"
                  className="ml-2 p-1 text-red-500 hover:text-red-700 transition-colors"
                  onClick={() => onRemoveFilter(filter.id)}
                  title="Удалить"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBuilder;