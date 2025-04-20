import React from 'react';
import { ReportFormData } from '../reportCreation/useReportCreation';

interface BasicInfoStepProps {
  formData: ReportFormData;
  updateForm: (key: keyof ReportFormData, value: any) => void;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ formData, updateForm }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Основная информация</h3>
      <p className="text-sm text-gray-500">
        Укажите основные данные для вашего отчёта.
      </p>

      <div className="space-y-4 mt-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Название отчёта
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => updateForm('name', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
                     bg-white border px-3 py-2 transition duration-150 ease-in-out"
            placeholder="Например: Ежеквартальный отчёт по продажам"
            autoFocus
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Описание
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => updateForm('description', e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
                      bg-white border px-3 py-2 transition duration-150 ease-in-out"
            placeholder="Например: Отчёт показывает результаты продаж по кварталам во всех отделах"
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;