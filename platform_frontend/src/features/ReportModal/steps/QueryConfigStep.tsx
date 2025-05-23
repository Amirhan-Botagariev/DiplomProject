import React from 'react';
import { ReportFormData } from '../reportCreation/useReportCreation';
import SQLBuilder from './sql-builder/SQLBuilder';

interface Props {
  formData: ReportFormData;
  updateForm: (key: keyof ReportFormData, value: any) => void;
  onQueryChange: (query: string) => void;
}

const QueryConfigStep: React.FC<Props> = ({ formData, updateForm }) => {
  if (formData.query_mode !== 'builder') {
    return <div className="text-gray-500 text-sm">Конструктор доступен только при выборе SQL Builder</div>;
  }

  const handleQueryChange = (query: string) => {
    updateForm('query', query);
  };

  return (
    <div className="w-full">
      <SQLBuilder onQueryChange={handleQueryChange} />
    </div>
  );
};

export default QueryConfigStep;