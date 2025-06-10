import React from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { EmployeeFilters } from './employee';

interface FilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  filters: EmployeeFilters;
  onApplyFilters: (filters: EmployeeFilters) => void;
  departments: string[];
}

const FilterDialog: React.FC<FilterDialogProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  departments,
}) => {
  const [localFilters, setLocalFilters] = React.useState<EmployeeFilters>(filters);

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm w-full bg-white rounded-lg shadow-xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                Фильтры
              </Dialog.Title>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Департамент */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Департамент
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 p-2"
                  value={localFilters.department || ''}
                  onChange={(e) =>
                    setLocalFilters((f) => ({
                      ...f,
                      department: e.target.value || undefined,
                    }))
                  }
                >
                  <option value="">Все департаменты</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Статус */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Статус
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 p-2"
                  value={localFilters.status || ''}
                  onChange={(e) =>
                    setLocalFilters((f) => ({
                      ...f,
                      status: e.target.value as 'active' | 'inactive' | undefined,
                    }))
                  }
                >
                  <option value="">Любой статус</option>
                  <option value="active">Активен</option>
                  <option value="inactive">Уволен</option>
                </select>
              </div>

              {/* Сортировка */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Сортировать по
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 p-2"
                  value={localFilters.sortBy || ''}
                  onChange={(e) =>
                    setLocalFilters((f) => ({
                      ...f,
                      sortBy: e.target.value as
                        | 'name'
                        | 'age'
                        | 'startDate'
                        | 'position'
                        | undefined,
                    }))
                  }
                >
                  <option value="">Без сортировки</option>
                  <option value="name">Имя</option>
                  <option value="age">Возраст</option>
                  <option value="startDate">Дата начала</option>
                  <option value="position">Должность</option>
                </select>
              </div>

              {/* Порядок сортировки */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Направление сортировки
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 p-2"
                  value={localFilters.sortOrder || ''}
                  onChange={(e) =>
                    setLocalFilters((f) => ({
                      ...f,
                      sortOrder: e.target.value as 'asc' | 'desc' | undefined,
                    }))
                  }
                >
                  <option value="asc">По возрастанию</option>
                  <option value="desc">По убыванию</option>
                </select>
              </div>

              {/* Пол */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Пол
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 p-2"
                  value={localFilters.gender || ''}
                  onChange={(e) =>
                    setLocalFilters((f) => ({
                      ...f,
                      gender: e.target.value || undefined,
                    }))
                  }
                >
                  <option value="">Все</option>
                  <option value="Male">Мужской</option>
                  <option value="Female">Женский</option>
                </select>
              </div>

              {/* Возраст */}
              <div className="flex space-x-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Возраст от
                  </label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={localFilters.ageMin ?? ''}
                    onChange={(e) =>
                      setLocalFilters((f) => ({
                        ...f,
                        ageMin: Number(e.target.value) || undefined,
                      }))
                    }
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    до
                  </label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={localFilters.ageMax ?? ''}
                    onChange={(e) =>
                      setLocalFilters((f) => ({
                        ...f,
                        ageMax: Number(e.target.value) || undefined,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            {/* Кнопки */}
            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => setLocalFilters({})}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Сбросить
              </button>
              <button
                onClick={handleApply}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Применить
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default FilterDialog;
