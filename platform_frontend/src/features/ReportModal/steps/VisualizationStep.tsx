import React from 'react';
import { motion } from 'framer-motion';
import { ReportFormData, Visualization } from '../reportCreation/useReportCreation';
import { BarChart3, PieChart, Table2 } from 'lucide-react';
import PreviewChart from '../PreviewChart';

interface VisualizationStepProps {
  formData: ReportFormData;
  updateForm: (key: keyof ReportFormData, value: any) => void;
}

const visualizations: Array<{
  id: Visualization;
  name: string;
  description: string;
  icon: React.ReactNode;
}> = [
  {
    id: 'table',
    name: 'Таблица',
    description: 'Отображение данных в виде таблицы',
    icon: <Table2 className="h-12 w-12 text-indigo-500" />,
  },
  {
    id: 'bar',
    name: 'Гистограмма',
    description: 'Сравнение значений по категориям',
    icon: <BarChart3 className="h-12 w-12 text-green-500" />,
  },
  {
    id: 'pie',
    name: 'Круговая диаграмма',
    description: 'Показать доли от общего количества',
    icon: <PieChart className="h-12 w-12 text-purple-500" />,
  },
];

const VisualizationStep: React.FC<VisualizationStepProps> = ({ formData, updateForm }) => {
  const [showPreview, setShowPreview] = React.useState(false);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Выберите тип визуализации</h3>
      <p className="text-sm text-gray-500">
        Укажите, как вы хотите отобразить данные в отчёте.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        {visualizations.map((viz, index) => (
          <motion.div
            key={viz.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex flex-col items-center p-6 rounded-lg border cursor-pointer transition-all duration-200
                      ${formData.visualization === viz.id 
                       ? 'border-indigo-500 bg-indigo-50' 
                       : 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50'}`}
            onClick={() => updateForm('visualization', viz.id)}
          >
            <motion.div
              className="flex items-center justify-center mb-4 p-4 rounded-full bg-white shadow-sm"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {viz.icon}
            </motion.div>
            <h4 className="text-base font-medium text-gray-900 mb-1">
              {viz.name}
            </h4>
            <p className="text-xs text-gray-500 text-center">{viz.description}</p>

            <div className="mt-4">
              <div className={`h-4 w-4 rounded-full border 
                             ${formData.visualization === viz.id 
                              ? 'border-indigo-500 bg-indigo-500' 
                              : 'border-gray-300'}`}
              >
                {formData.visualization === viz.id && (
                  <div className="h-2 w-2 rounded-full bg-white m-0.5" />
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {formData.visualization && (
        <div className="mt-8">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            {showPreview ? 'Скрыть превью' : 'Показать превью'}
          </button>

          {showPreview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 border rounded-lg bg-white"
            >
              <PreviewChart
                type={formData.visualization}
                data={formData}
              />
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default VisualizationStep;