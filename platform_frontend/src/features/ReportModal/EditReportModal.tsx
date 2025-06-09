import React, { Fragment, useCallback, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';

import useReportCreation from './reportCreation/useReportCreation';
import StepIndicator from './StepIndicator';
import ReportModalFooter from './ReportModalFooter';

import BasicInfoStep from './steps/BasicInfoStep';
import QueryConfigStep from './steps/QueryConfigStep';
import ChartConfigStep from './steps/ChartConfigStep';

import { Graph } from '../../lib/types';

interface EditReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  routeId: string;
  initialGraph: Graph;
}

const steps = ['Основное', 'Запрос', 'Настройки графика'];

const EditReportModal: React.FC<EditReportModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  routeId,
  initialGraph,
}) => {
  const {
    currentStep,
    totalSteps,
    formData,
    updateForm,
    goToNextStep,
    goToPreviousStep,
    validateCurrentStep,
    resetForm,
  } = useReportCreation();

  useEffect(() => {
    if (!initialGraph) return;

    updateForm('name', initialGraph.name);
    updateForm('description', initialGraph.description ?? '');
    updateForm('query', initialGraph.query);
    updateForm('visualization', initialGraph.chart_type);
    updateForm('fields', [
      initialGraph.ox_name ?? '',
      initialGraph.oy_name ?? '',
      initialGraph.legend ?? '',
    ]);
  }, [initialGraph]);

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

  const handleComplete = async () => {
    const validation = validateCurrentStep();
    if (!validation.isValid) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/dashboards`);
      const dashboards = await res.json();
      const dashboard = dashboards.find((d: any) => d.route_id === routeId);
      if (!dashboard) {
        console.error("Дэшборд по routeId не найден:", routeId);
        return;
      }

      const updatedGraphs = (dashboard.graphs || []).map((g: Graph) =>
        g.name === initialGraph.name
          ? {
              ...g,
              name: formData.name,
              description: formData.description,
              query: formData.query,
              chart_type: formData.visualization,
              ox_name: formData.fields?.[0],
              oy_name: formData.fields?.[1],
              legend: formData.fields?.[2],
            }
          : g
      );
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/dashboards/${dashboard.routeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...dashboard, graphs: updatedGraphs }),
      });

      console.log('✅ График обновлён');
      resetForm();
      onClose();
      onSuccess?.();
    } catch (err: any) {
      alert('Не удалось сохранить изменения: ' + err.message);
    }
  };

  const handleQueryChange = useCallback(
    (query: string) => {
      updateForm('query', query);
    },
    [updateForm]
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep formData={formData} updateForm={updateForm} />;
      case 2:
        return (
          <QueryConfigStep
            formData={formData}
            updateForm={updateForm}
            onQueryChange={handleQueryChange}
          />
        );
      case 3:
        return (
          <ChartConfigStep
            ox={formData.fields[0] || ''}
            oy={formData.fields[1] || ''}
            legend={formData.fields[2] || ''}
            chartType={formData.visualization || 'bar'}
            onChange={(key, value) => {
              if (key === 'chart_type') {
                updateForm('visualization', value);
                return;
              }
              const updated = [...formData.fields];
              if (key === 'ox') updated[0] = value;
              if (key === 'oy') updated[1] = value;
              if (key === 'legend') updated[2] = value;
              updateForm('fields', updated);
            }}
          />
        );
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
                Редактирование графика
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
                mode="edit"
              />
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default EditReportModal;