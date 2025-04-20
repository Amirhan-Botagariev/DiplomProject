import React from 'react';
import { ReportFormData } from './reportCreation/useReportCreation';

interface PreviewChartProps {
  type: string;
  data: ReportFormData;
}

const PreviewChart: React.FC<PreviewChartProps> = ({ type, data }) => {
  const getMockData = () => {
    switch (data.source) {
      case 'users':
        return [
          { label: 'Активные', value: 65 },
          { label: 'Неактивные', value: 35 },
          { label: 'Новые', value: 20 },
        ];
      case 'orders':
        return [
          { label: 'Завершённые', value: 80 },
          { label: 'В ожидании', value: 15 },
          { label: 'Отменённые', value: 5 },
        ];
      case 'departments':
        return [
          { label: 'Продажи', value: 45 },
          { label: 'Маркетинг', value: 30 },
          { label: 'Инженеры', value: 25 },
        ];
      case 'products':
        return [
          { label: 'Электроника', value: 40 },
          { label: 'Одежда', value: 35 },
          { label: 'Книги', value: 25 },
        ];
      default:
        return [];
    }
  };

  const mockData = getMockData();

  const renderPreview = () => {
    switch (type) {
      case 'table':
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {data.fields.map((field) => (
                    <th
                      key={field}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {field}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[1, 2, 3].map((row) => (
                  <tr key={row}>
                    {data.fields.map((field) => (
                      <td
                        key={field}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        Пример {field}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'bar':
        return (
          <div className="h-64 flex items-end justify-around p-4">
            {mockData.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="w-16 bg-indigo-500 rounded-t"
                  style={{ height: `${item.value}%` }}
                />
                <span className="mt-2 text-xs text-gray-600">{item.label}</span>
              </div>
            ))}
          </div>
        );

      case 'pie':
        return (
          <div className="h-64 flex items-center justify-center">
            <div className="relative w-48 h-48">
              {mockData.map((_item, index) => {
                const rotation = index * (360 / mockData.length);
                return (
                  <div
                    key={index}
                    className="absolute inset-0"
                    style={{
                      transform: `rotate(${rotation}deg)`,
                      clipPath: 'polygon(50% 50%, 100% 0, 100% 100%)',
                    }}
                  >
                    <div
                      className="w-full h-full bg-indigo-500"
                      style={{
                        opacity: 0.3 + (index * 0.2),
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg p-4">
      <h4 className="text-sm font-medium text-gray-900 mb-4">Предпросмотр</h4>
      {renderPreview()}
      <p className="text-xs text-gray-500 mt-4 text-center">
        Это демонстрационный предварительный просмотр. Финальный отчёт будет использовать выбранный источник данных и фильтры.
      </p>
    </div>
  );
};

export default PreviewChart;