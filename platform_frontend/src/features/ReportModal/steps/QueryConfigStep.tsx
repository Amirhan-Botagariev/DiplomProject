import React, { useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { ReportFormData } from '../reportCreation/useReportCreation';
import TableSchemaExplorer from './TableSchemaExplorer';

const schema = {
  employees: [
    "employee_id", "employee_number", "gender_id", "marital_status_id", "education_level",
    "education_field_id", "department_id", "job_role_id", "job_level", "attrition",
    "business_travel_id", "num_companies_worked", "total_working_years", "years_at_company",
    "years_in_current_role", "years_since_last_promotion", "years_with_curr_manager",
    "work_life_balance", "training_times_last_year", "created_at", "updated_at"
  ],
  departments: ["department_id", "department_name"],
  genders: ["gender_id", "gender_name"],
  job_roles: ["job_role_id", "job_role_name"],
  marital_statuses: ["marital_status_id", "marital_status_name"],
  business_travel: ["business_travel_id", "travel_type"],
  attrition_predictions: ["employee_number", "predicted_attrition_prob", "predicted_at"],
  performance_reviews: ["employee_id", "review_date", "performance_rating", "job_involvement"],
  query_cache: ["id", "query_hash", "result_json"],
  salaries: ["employee_id", "monthly_income", "hourly_rate", "percent_salary_hike"],
  users: ["id", "email", "is_superuser"],
  dashboard_configurations: ["id", "name", "route_id", "description", "graphs"],
};

interface Props {
  formData: ReportFormData;
  updateForm: (key: keyof ReportFormData, value: any) => void;
  onQueryChange: (query: string) => void;
}

const QueryConfigStep: React.FC<Props> = ({ formData, updateForm, onQueryChange }) => {
  const query = formData.query || '';

  useEffect(() => {
    // При первом рендере — если query пустой, очистим
    if (!formData.query) {
      updateForm('query', '');
    }
  }, []);

  const handleQueryChange = (value: string) => {
    updateForm('query', value);
    onQueryChange(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          SQL-запрос:
        </label>
        <CodeMirror
          value={query}
          height="300px"
          extensions={[sql()]}
          theme="light"
          onChange={(value) => handleQueryChange(value)}
        />
        {query.trim().length === 0 && (
          <p className="mt-2 text-sm text-red-500">Поле запроса не может быть пустым</p>
        )}
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-800 mb-2">Таблицы и поля</p>
        <TableSchemaExplorer schema={schema} />
      </div>
    </div>
  );
};

export default QueryConfigStep;