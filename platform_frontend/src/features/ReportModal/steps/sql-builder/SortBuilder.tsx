import React, { useState } from 'react';
import { Sort, VisualField } from './index.ts';
import { ArrowUpDown, ArrowDown, ArrowUp, X } from 'lucide-react';

interface SortBuilderProps {
  sorts: Sort[];
  selectedFields: VisualField[];
  onAddSort: (sort: Sort) => void;
  onRemoveSort: (sortId: string) => void;
  onUpdateSort: (sort: Sort) => void;
}

const SortBuilder: React.FC<SortBuilderProps> = ({
  sorts,
  selectedFields,
  onAddSort,
  onRemoveSort,
  onUpdateSort
}) => {
  const [selectedField, setSelectedField] = useState<string>('');
  const [direction, setDirection] = useState<'asc' | 'desc'>('asc');

  const handleAddSort = () => {
    if (selectedField) {
      const field = selectedFields.find(f => f.id === selectedField);
      if (field) {
        const newSort: Sort = {
          id: Date.now().toString(),
          field,
          direction
        };
        onAddSort(newSort);
        setSelectedField('');
        setDirection('asc');
      }
    }
  };

  const toggleDirection = (sort: Sort) => {
    const newDirection = sort.direction === 'asc' ? 'desc' : 'asc';
    onUpdateSort({
      ...sort,
      direction: newDirection
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
        <ArrowUpDown className="h-5 w-5 mr-2 text-green-500" />
        Сортировка
      </h2>

      <div className="mb-4 p-4 border border-gray-200 rounded-md bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label htmlFor="sort-field-select" className="block text-sm font-medium text-gray-700 mb-1">
              Сортировать по
            </label>
            <select
              id="sort-field-select"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
            >
              <option value="">Выберите поле</option>
              {selectedFields.map(field => (
                <option key={field.id} value={field.id}>
                  {field.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="sort-direction-select" className="block text-sm font-medium text-gray-700 mb-1">
              Направление
            </label>
            <div className="flex">
              <select
                id="sort-direction-select"
                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={direction}
                onChange={(e) => setDirection(e.target.value as 'asc' | 'desc')}
              >
                <option value="asc">По возрастанию</option>
                <option value="desc">По убыванию</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleAddSort}
            disabled={!selectedField}
          >
            Добавить сортировку
          </button>
        </div>
      </div>

      {sorts.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Порядок сортировки:</h3>
          <div className="space-y-2">
            {sorts.map((sort, index) => (
              <div key={sort.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-md">
                <div className="flex items-center flex-1">
                  <span className="text-gray-500 mr-2">{index + 1}.</span>
                  <span className="font-medium text-gray-800">{sort.field.label}</span>
                  <button
                    type="button"
                    className="ml-3 p-1 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                    onClick={() => toggleDirection(sort)}
                    title={sort.direction === 'asc' ? 'По возрастанию' : 'По убыванию'}
                  >
                    {sort.direction === 'asc' ? (
                      <ArrowUp className="h-4 w-4 text-gray-700" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-gray-700" />
                    )}
                  </button>
                </div>
                <button
                  type="button"
                  className="ml-2 p-1 text-red-500 hover:text-red-700 transition-colors"
                  onClick={() => onRemoveSort(sort.id)}
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

export default SortBuilder;