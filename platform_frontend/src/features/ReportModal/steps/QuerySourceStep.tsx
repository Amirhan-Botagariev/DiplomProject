import React from "react";
import { ReportFormData } from "../reportCreation/useReportCreation";
import { Code, Wrench, Library } from "lucide-react";

interface QuerySourceStepProps {
  formData: ReportFormData;
  updateForm: (key: keyof ReportFormData, value: any) => void;
}

const options = [
  {
    id: "template",
    title: "Готовый шаблон",
    description: "Использовать предустановленные SQL-запросы для типичных сценариев.",
    icon: <Library className="h-6 w-6 text-green-500" />,
  },
  {
    id: "builder",
    title: "SQL Builder",
    description: "Создать запрос визуально с помощью конструктора.",
    icon: <Wrench className="h-6 w-6 text-blue-500" />,
  },
  {
    id: "custom",
    title: "Кастомный SQL",
    description: "Ввести SQL-запрос вручную для полной гибкости.",
    icon: <Code className="h-6 w-6 text-red-500" />,
  },
] as const;

const QuerySourceStep: React.FC<QuerySourceStepProps> = ({ formData, updateForm }) => {
  const selected = formData.query_mode;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Метод получения данных</h3>
      <p className="text-sm text-gray-500">Выберите способ, с помощью которого вы хотите сформировать SQL-запрос.</p>

      <div className="grid grid-cols-1 gap-4 mt-6">
        {options.map((option) => (
          <div
            key={option.id}
            onClick={() => updateForm("query_mode", option.id)}
            className={`cursor-pointer rounded-lg border p-4 transition-all duration-200
              ${selected === option.id
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50"}
            `}
          >
            <div className="flex items-start space-x-3">
              {option.icon}
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900">{option.title}</h4>
                <p className="text-sm text-gray-500">{option.description}</p>
              </div>
              <div className="flex-shrink-0">
                <div
                  className={`h-5 w-5 rounded-full border flex items-center justify-center
                    ${selected === option.id ? "border-indigo-500 bg-indigo-500" : "border-gray-300"}
                  `}
                >
                  {selected === option.id && <div className="h-2 w-2 bg-white rounded-full" />}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuerySourceStep;