import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { Employee } from '../../components/employeeList/employee';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newEmployee: Employee) => void;
}

const EmployeeCreateModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name: '',
    age: 30,
    education_level: 3,
    department: 'Research & Development',
    position: 'Research Scientist',
  });

  const departmentMap: Record<string, number> = {
    'Research & Development': 1,
    'Sales': 2,
    'Human Resources': 3,
  };

  const jobRoleMap: Record<string, number> = {
    'Research Scientist': 1,
    'Sales Executive': 2,
    'Laboratory Technician': 3,
  };

  const handleChange = (key: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    // 🧠 Фейковое создание объекта
    const fakeNewEmployee: Employee = {
      id: Math.floor(Math.random() * 100000), // временный ID
      name: form.name || 'Без имени',
      age: form.age,
      education_level: form.education_level,
      department: form.department,
      position: form.position,
      status: 'active',
      email: '',
      phone: '',
      avatar: null,
      startDate: new Date().toISOString().split('T')[0],

      // Дополнительные поля
      gender: 'Male',
      marital_status: 'Single',
      education_field: 'Life Sciences',
      job_level: 1,
      job_involvement: 2,
      job_satisfaction: 2,
      performance_rating: 3,
      years_at_company: 1,
      risk: 0.1,
    };

    await new Promise(res => setTimeout(res, 300)); // фейковая задержка
    onSuccess(fakeNewEmployee);
    onClose();
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
          <Dialog.Panel className="w-full max-w-md bg-white rounded-lg p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-xl font-bold">Добавить сотрудника</Dialog.Title>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Имя</label>
                <input
                  type="text"
                  className="mt-1 w-full border px-3 py-2 rounded"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Возраст</label>
                <input
                  type="number"
                  className="mt-1 w-full border px-3 py-2 rounded"
                  value={form.age}
                  onChange={(e) => handleChange('age', Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Образование (1-5)</label>
                <input
                  type="number"
                  className="mt-1 w-full border px-3 py-2 rounded"
                  value={form.education_level}
                  onChange={(e) => handleChange('education_level', Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Департамент</label>
                <select
                  className="mt-1 w-full border px-3 py-2 rounded"
                  value={form.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                >
                  {Object.keys(departmentMap).map(dep => (
                    <option key={dep} value={dep}>{dep}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Должность</label>
                <select
                  className="mt-1 w-full border px-3 py-2 rounded"
                  value={form.position}
                  onChange={(e) => handleChange('position', e.target.value)}
                >
                  {Object.keys(jobRoleMap).map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
              >
                Отмена
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Сохранить
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default EmployeeCreateModal;
