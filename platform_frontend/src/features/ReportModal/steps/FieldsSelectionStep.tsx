import React from 'react';
import { ReportFormData } from '../reportCreation/useReportCreation';

interface FieldsSelectionStepProps {
  formData: ReportFormData;
  updateForm: (key: keyof ReportFormData, value: any) => void;
}

// Пример данных полей для каждого источника
const getAvailableFields = (source: string) => {
  if (source === 'users') {
    return [
      {id: 'user_id', name: 'ID пользователя', description: 'Уникальный идентификатор каждого пользователя'},
      {id: 'name', name: 'Имя', description: 'Полное имя пользователя'},
      {id: 'email', name: 'Email', description: 'Электронная почта пользователя'},
      {id: 'role', name: 'Роль', description: 'Роль пользователя в системе'},
      {id: 'created_at', name: 'Создан', description: 'Дата создания аккаунта'},
      {id: 'last_login', name: 'Последний вход', description: 'Последняя авторизация пользователя'},
    ];
  } else if (source === 'orders') {
    return [
      {id: 'order_id', name: 'ID заказа', description: 'Уникальный номер заказа'},
      {id: 'customer_id', name: 'ID клиента', description: 'Идентификатор клиента, оформившего заказ'},
      {id: 'product_id', name: 'ID продукта', description: 'Идентификатор купленного товара'},
      {id: 'amount', name: 'Сумма', description: 'Сумма заказа'},
      {id: 'status', name: 'Статус', description: 'Текущий статус заказа'},
      {id: 'created_at', name: 'Создан', description: 'Дата оформления заказа'},
    ];
  } else if (source === 'departments') {
    return [
      {id: 'dept_id', name: 'ID отдела', description: 'Уникальный идентификатор отдела'},
      {id: 'name', name: 'Название', description: 'Название отдела'},
      {id: 'manager_id', name: 'ID менеджера', description: 'Руководитель отдела'},
      {id: 'budget', name: 'Бюджет', description: 'Выделенный бюджет отдела'},
      {id: 'location', name: 'Локация', description: 'Физическое расположение отдела'},
    ];
  } else if (source === 'products') {
    return [
      {id: 'product_id', name: 'ID продукта', description: 'Уникальный идентификатор товара'},
      {id: 'name', name: 'Название', description: 'Наименование товара'},
      {id: 'category', name: 'Категория', description: 'Категория товара'},
      {id: 'price', name: 'Цена', description: 'Стоимость товара'},
      {id: 'stock', name: 'Остаток', description: 'Оставшееся количество на складе'},
      {id: 'created_at', name: 'Создан', description: 'Дата добавления товара'},
    ];
  } else {
    return [];
  }
};

const FieldsSelectionStep: React.FC<FieldsSelectionStepProps> = ({ formData, updateForm }) => {
  const availableFields = getAvailableFields(formData.source);

  const handleFieldToggle = (fieldId: string) => {
    const updatedFields = formData.fields.includes(fieldId)
      ? formData.fields.filter((id) => id !== fieldId)
      : [...formData.fields, fieldId];

    updateForm('fields', updatedFields);
  };

  const handleSelectAll = () => {
    updateForm('fields', availableFields.map(field => field.id));
  };

  const handleDeselectAll = () => {
    updateForm('fields', []);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Выбор полей</h3>
      <p className="text-sm text-gray-500">
        Выберите поля, которые вы хотите включить в отчёт.
      </p>

      <div className="flex justify-end space-x-2 mt-2">
        <button
          type="button"
          onClick={handleSelectAll}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
        >
          Выбрать все
        </button>
        <span className="text-gray-300">|</span>
        <button
          type="button"
          onClick={handleDeselectAll}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
        >
          Снять выделение
        </button>
      </div>

      <div className="mt-4 space-y-3 max-h-[320px] overflow-y-auto pr-2">
        {availableFields.map((field) => (
          <div
            key={field.id}
            className="flex items-start"
          >
            <div className="flex items-center h-5">
              <input
                id={`field-${field.id}`}
                name={`field-${field.id}`}
                type="checkbox"
                checked={formData.fields.includes(field.id)}
                onChange={() => handleFieldToggle(field.id)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-colors"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor={`field-${field.id}`} className="font-medium text-gray-700 cursor-pointer">
                {field.name}
              </label>
              <p className="text-gray-500">{field.description}</p>
            </div>
          </div>
        ))}

        {availableFields.length === 0 && (
          <div className="py-4 text-center text-sm text-gray-500">
            Нет доступных полей. Сначала выберите источник данных.
          </div>
        )}
      </div>
    </div>
  );
};

export default FieldsSelectionStep;