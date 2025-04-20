import React from 'react';
import { Filter, FilterOperator, ReportFormData } from '../reportCreation/useReportCreation';
import { Plus, Trash2 } from 'lucide-react';

interface FiltersStepProps {
  formData: ReportFormData;
  addFilter: () => void;
  updateFilter: (id: string, key: keyof Filter, value: any) => void;
  removeFilter: (id: string) => void;
}

// Поля в зависимости от источника
const getAvailableFields = (source: string) => {
  switch (source) {
    case 'users':
      return [
        { id: 'user_id', name: 'ID пользователя' },
        { id: 'name', name: 'Имя' },
        { id: 'email', name: 'Email' },
        { id: 'role', name: 'Роль' },
        { id: 'created_at', name: 'Создан' },
        { id: 'last_login', name: 'Последний вход' },
      ];
    case 'orders':
      return [
        { id: 'order_id', name: 'ID заказа' },
        { id: 'customer_id', name: 'ID клиента' },
        { id: 'product_id', name: 'ID продукта' },
        { id: 'amount', name: 'Сумма' },
        { id: 'status', name: 'Статус' },
        { id: 'created_at', name: 'Создан' },
      ];
    case 'departments':
      return [
        { id: 'dept_id', name: 'ID отдела' },
        { id: 'name', name: 'Название' },
        { id: 'manager_id', name: 'ID менеджера' },
        { id: 'budget', name: 'Бюджет' },
        { id: 'location', name: 'Локация' },
      ];
    case 'products':
      return [
        { id: 'product_id', name: 'ID продукта' },
        { id: 'name', name: 'Название' },
        { id: 'category', name: 'Категория' },
        { id: 'price', name: 'Цена' },
        { id: 'stock', name: 'Остаток' },
        { id: 'created_at', name: 'Создан' },
      ];
    default:
      return [];
  }
};

const operators: Array<{ value: FilterOperator; label: string }> = [
  { value: 'equals', label: 'Равно' },
  { value: 'contains', label: 'Содержит' },
  { value: 'greater_than', label: 'Больше чем' },
  { value: 'less_than', label: 'Меньше чем' },
  { value: 'between', label: 'Между' },
];

const FiltersStep: React.FC<FiltersStepProps> = ({
  formData,
  addFilter,
  updateFilter,
  removeFilter,
}) => {
  const availableFields = getAvailableFields(formData.source);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Фильтры</h3>
      <p className="text-sm text-gray-500">
        Добавьте фильтры, чтобы сузить выборку данных для отчёта.
      </p>

      <div className="mt-6 space-y-4">
        {formData.filters.length > 0 ? (
          formData.filters.map((filter) => (
            <div key={filter.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border border-gray-200 rounded-md bg-gray-50">
              <div className="w-full sm:w-1/3">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Поле
                </label>
                <select
                  value={filter.field}
                  onChange={(e) => updateFilter(filter.id, 'field', e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Выберите поле</option>
                  {availableFields.map((field) => (
                    <option key={field.id} value={field.id}>
                      {field.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full sm:w-1/3">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Оператор
                </label>
                <select
                  value={filter.operator}
                  onChange={(e) => updateFilter(filter.id, 'operator', e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  {operators.map((op) => (
                    <option key={op.value} value={op.value}>
                      {op.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full sm:w-1/3">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Значение
                </label>
                <input
                  type="text"
                  value={filter.value}
                  onChange={(e) => updateFilter(filter.id, 'value', e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Введите значение"
                />
              </div>

              <div className="flex items-end justify-end">
                <button
                  type="button"
                  onClick={() => removeFilter(filter.id)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-sm text-gray-500">
            Пока нет ни одного фильтра. Нажмите, чтобы добавить.
          </div>
        )}

        <div className="flex justify-center">
          <button
            type="button"
            onClick={addFilter}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Добавить фильтр
          </button>
        </div>
      </div>
    </div>
  );
};

export default FiltersStep;