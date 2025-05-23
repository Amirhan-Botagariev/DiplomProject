import React, {Fragment, useCallback, useEffect} from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';

import useReportCreation from './reportCreation/useReportCreation';
import StepIndicator from './StepIndicator';
import ReportModalFooter from './ReportModalFooter';

import BasicInfoStep from './steps/BasicInfoStep';
import QuerySourceStep from './steps/QuerySourceStep';
import FieldSelectionStep from './steps/sql-builder/FieldSelection.tsx';
import FiltersStep from './steps/FiltersStep';
import VisualizationStep from './steps/VisualizationStep';
import QueryConfigStep from "./steps/QueryConfigStep.tsx";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps = [
  'Основное',
  'Источник данных',
  'Конструктор запроса',
  'Выбор полей',
  'Фильтры',
  'Визуализация',
];

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose }) => {
  const {
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
  } = useReportCreation();

  useEffect(() => {
    const sidebar = document.querySelector('.sidebar');
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      sidebar?.classList.add('hidden');
    } else {
      document.body.style.overflow = '';
      sidebar?.classList.remove('hidden');
    }

    return () => {
      document.body.style.overflow = '';
      sidebar?.classList.remove('hidden');
    };
  }, [isOpen]);

  const handleComplete = () => {
    const validation = validateCurrentStep();
    if (validation.isValid) {
      console.log('✅ Отчёт создан:', formData);
      resetForm();
      onClose();
    }
  };

  const handleQueryChange = useCallback((query: string) => {
    updateForm('query', query);
  }, [updateForm]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep formData={formData} updateForm={updateForm} />;
      case 2:
        return <QuerySourceStep formData={formData} updateForm={updateForm} />;
      case 3:
        return (
          <QueryConfigStep
            formData={formData}
            updateForm={updateForm}
            onQueryChange={handleQueryChange}
          />
        );
      case 4:
        return (
          <FieldSelectionStep
            formData={formData}
            updateForm={updateForm}
          />
        );
      case 5:
        return (
          <FiltersStep
            formData={formData}
            addFilter={addFilter}
            updateFilter={updateFilter}
            removeFilter={removeFilter}
          />
        );
      case 6:
        return <VisualizationStep formData={formData} updateForm={updateForm} />;
      default:
        return null;
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white p-6 shadow-xl transition-all">
              <div className="absolute right-4 top-4">
                <button
                  onClick={() => {
                    resetForm();
                    onClose();
                  }}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <Dialog.Title className="text-xl font-bold mb-4">
                Создание нового отчёта
              </Dialog.Title>

              <StepIndicator
                currentStep={currentStep}
                totalSteps={totalSteps}
                steps={steps}
              />

              <div className="my-6 min-h-[300px]">{renderStepContent()}</div>

              <ReportModalFooter
                currentStep={currentStep}
                totalSteps={totalSteps}
                onBack={goToPreviousStep}
                onNext={goToNextStep}
                onComplete={handleComplete}
                validation={validateCurrentStep()}
              />
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ReportModal;