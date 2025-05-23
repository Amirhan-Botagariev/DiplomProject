import React from 'react';
import { ReportFormData } from '../reportCreation/useReportCreation';
import FieldSelection from '../steps/sql-builder/FieldSelection';
import { getFieldsByTable } from './sql-builder/fieldMappings.ts';

interface Props {
  formData: ReportFormData;
  updateForm: (key: keyof ReportFormData, value: any) => void;
}

const FieldSelectionStep: React.FC<Props> = ({ formData, updateForm }) => {
  const availableFields = getFieldsByTable()[formData.source] ?? [];

  // Convert string IDs in formData.fields to VisualField[]
  const selectedFields = availableFields.filter(field =>
    formData.fields.includes(field.id)
  );

  return (
    <FieldSelection
      selectedFields={selectedFields}
      fields={availableFields}
      onFieldSelect={(field) => updateForm('fields', [...formData.fields, field.id])}
      onFieldDeselect={(field) =>
        updateForm(
          'fields',
          formData.fields.filter((id) => id !== field.id)
        )
      }
    />
  );
};

export default FieldSelectionStep;