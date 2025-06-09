import React from 'react';

interface ReportModalFooterProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  onComplete: () => void;
  validation: { isValid: boolean; message?: string };
  mode?: 'create' | 'edit';
}

const ReportModalFooter: React.FC<ReportModalFooterProps> = ({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onComplete,
  validation,
  mode = 'create',
}) => {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="pt-6 pb-4 px-6 bg-gray-50 rounded-b-lg">
      <div className="flex items-center justify-between">
        <div>
          {validation.message && (
            <p className="text-sm text-red-600 mb-0">{validation.message}</p>
          )}
        </div>
        <div className="flex items-center space-x-3">
          {!isFirstStep && (
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Назад
            </button>
          )}

          {!isLastStep ? (
            <button
              type="button"
              onClick={onNext}
              disabled={!validation.isValid}
              className={`px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors
                ${!validation.isValid 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-indigo-700'}`}
            >
              Далее
            </button>
          ) : (
            <button
              type="button"
              onClick={onComplete}
              disabled={!validation.isValid}
              className={`px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors
                ${!validation.isValid 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-indigo-700'}`}
            >
              {mode === 'edit' ? 'Сохранить' : 'Создать отчёт'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportModalFooter;