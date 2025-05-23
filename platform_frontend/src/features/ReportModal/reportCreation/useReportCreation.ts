import { useState } from 'react';

export type DataSource = 'users' | 'orders' | 'departments' | 'products';
export type QueryMode = 'template' | 'builder' | 'custom';
export type Visualization = 'table' | 'bar' | 'pie';

export type FilterOperator = 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between';

export interface Filter {
  id: string;
  field: string;
  operator: FilterOperator;
  value: string;
}

export interface ReportFormData {
  name: string;
  description: string;
  source: DataSource | '';
  fields: string[];
  filters: Filter[];
  visualization: Visualization | '';
  query_mode: 'template' | 'builder' | 'custom';
  query: string;
}

export interface StepValidation {
  isValid: boolean;
  errorMessage: string;
}

const initialFormData: ReportFormData = {
  name: '',
  description: '',
  source: '',
  query_mode: 'builder',
  query: '',
  fields: [],
  filters: [],
  visualization: '',
};

const useReportCreation = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ReportFormData>(initialFormData);

  const totalSteps = 6;

  const updateForm = (key: keyof ReportFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const addFilter = () => {
    const newFilter: Filter = {
      id: Date.now().toString(),
      field: '',
      operator: 'equals',
      value: '',
    };
    setFormData((prev) => ({
      ...prev,
      filters: [...prev.filters, newFilter],
    }));
  };

  const updateFilter = (id: string, key: keyof Filter, value: any) => {
    setFormData((prev) => ({
      ...prev,
      filters: prev.filters.map((f) =>
        f.id === id ? { ...f, [key]: value } : f
      ),
    }));
  };

  const removeFilter = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      filters: prev.filters.filter((f) => f.id !== id),
    }));
  };

  const validateCurrentStep = (): StepValidation => {
    switch (currentStep) {
      case 1:
        if (!formData.name.trim()) {
          return { isValid: false, errorMessage: 'Введите название отчёта' };
        }
        return { isValid: true, errorMessage: '' };

      case 2:
        if (!formData.query_mode) {
          return { isValid: false, errorMessage: 'Выберите метод запроса' };
        }
        return { isValid: true, errorMessage: '' };

      case 3:
        if (!formData.source) {
          return { isValid: false, errorMessage: 'Выберите источник данных' };
        }
        return { isValid: true, errorMessage: '' };

      case 4:
        if (formData.fields.length === 0) {
          return {
            isValid: false,
            errorMessage: 'Выберите хотя бы одно поле',
          };
        }
        return { isValid: true, errorMessage: '' };

      case 5:
        const hasInvalid = formData.filters.some(
          (f) => !f.field || !f.value
        );
        if (hasInvalid) {
          return {
            isValid: false,
            errorMessage: 'Заполните все поля фильтров или удалите незаполненные',
          };
        }
        return { isValid: true, errorMessage: '' };

      case 6:
        if (!formData.visualization) {
          return {
            isValid: false,
            errorMessage: 'Выберите тип визуализации',
          };
        }
        return { isValid: true, errorMessage: '' };

      default:
        return { isValid: true, errorMessage: '' };
    }
  };

  const goToNextStep = () => {
    const { isValid } = validateCurrentStep();
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setFormData(initialFormData);
  };

  return {
    currentStep,
    totalSteps,
    formData,
    updateForm,
    goToNextStep,
    goToPreviousStep,
    validateCurrentStep,
    resetForm,
    addFilter,
    updateFilter,
    removeFilter,
  };
};

export default useReportCreation;