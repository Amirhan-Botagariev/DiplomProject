import React from 'react';
import { DataSource, ReportFormData } from '../reportCreation/useReportCreation';
import { Database, Users, Package, Building2 } from 'lucide-react';

interface DataSourceStepProps {
  formData: ReportFormData;
  updateForm: (key: keyof ReportFormData, value: any) => void;
}

// Примечание: данные можно будет позже подтягивать из API
const dataSources: Array<{
  id: DataSource;
  name: string;
  description: string;
  icon: React.ReactNode;
}> = [
  {
    id: 'users',
    name: 'Пользователи',
    description: 'Аккаунты пользователей и профильная информация',
    icon: <Users className="h-6 w-6 text-indigo-500" />,
  },
  {
    id: 'orders',
    name: 'Заказы',
    description: 'Информация о заказах и транзакциях клиентов',
    icon: <Package className="h-6 w-6 text-green-500" />,
  },
  {
    id: 'departments',
    name: 'Отделы',
    description: 'Структура и команды компании',
    icon: <Building2 className="h-6 w-6 text-orange-500" />,
  },
  {
    id: 'products',
    name: 'Продукты',
    description: 'Каталог товаров и информация о запасах',
    icon: <Database className="h-6 w-6 text-purple-500" />,
  },
];

const DataSourceStep: React.FC<DataSourceStepProps> = ({ formData, updateForm }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Выбор источника данных</h3>
      <p className="text-sm text-gray-500">
        Выберите источник данных, который будет использоваться в отчёте.
      </p>
      
      <div className="grid grid-cols-1 gap-4 mt-6">
        {dataSources.map((source) => (
          <div
            key={source.id}
            className={`relative rounded-lg border p-4 cursor-pointer transition-all duration-200 
                       ${formData.source === source.id 
                        ? 'border-indigo-500 bg-indigo-50' 
                        : 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-50/50'}`}
            onClick={() => updateForm('source', source.id)}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-3">{source.icon}</div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">
                  {source.name}
                </h4>
                <p className="text-xs text-gray-500 mt-1">{source.description}</p>
              </div>
              <div className="flex-shrink-0 ml-3">
                <div className={`h-5 w-5 rounded-full border flex items-center justify-center
                               ${formData.source === source.id 
                                 ? 'border-indigo-500 bg-indigo-500' 
                                 : 'border-gray-300'}`}
                >
                  {formData.source === source.id && (
                    <div className="h-2 w-2 rounded-full bg-white" />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataSourceStep;