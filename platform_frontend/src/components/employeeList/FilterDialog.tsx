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
                Filters
              </Dialog.Title>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 p-2"
                  value={localFilters.department || ''}
                  onChange={(e) => setLocalFilters(f => ({ ...f, department: e.target.value || undefined }))}
                >
                  <option value="">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 p-2"
                  value={localFilters.status || ''}
                  onChange={(e) => setLocalFilters(f => ({ ...f, status: e.target.value as 'active' | 'inactive' | undefined }))}
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 p-2"
                  value={localFilters.sortBy || ''}
                  onChange={(e) => setLocalFilters(f => ({ ...f, sortBy: e.target.value as 'name' | 'age' | 'startDate' | 'position' | undefined }))}
                >
                  <option value="">No Sorting</option>
                  <option value="name">Name</option>
                  <option value="age">Age</option>
                  <option value="startDate">Start Date</option>
                  <option value="position">Position</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort Order
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 p-2"
                  value={localFilters.sortOrder || ''}
                  onChange={(e) => setLocalFilters(f => ({ ...f, sortOrder: e.target.value as 'asc' | 'desc' | undefined }))}
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => setLocalFilters({})}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                onClick={handleApply}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Apply
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default FilterDialog;