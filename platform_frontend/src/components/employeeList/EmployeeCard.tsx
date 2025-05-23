import React from 'react';
import { Dialog } from '@headlessui/react';
import { Mail, Phone, Calendar, UserCircle, Building, Briefcase, X, Edit2, Trash2, Copy } from 'lucide-react';
import { Employee } from './employee';
import EmployeeEditForm from "./EmployeeEditForm.tsx";

interface EmployeeCardProps {
  employee: Employee;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (employee: Employee) => void;
  onDelete: (id: number) => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, isOpen, onClose, onEdit, onDelete }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // TODO: Show success notification
  };

  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
  setIsEditing(true);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      onDelete(employee.id);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
  <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

  <div className="fixed inset-0 flex items-center justify-center p-4">
    <Dialog.Panel className="mx-auto max-w-lg w-full bg-white rounded-lg shadow-xl p-6 relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <X className="h-5 w-5" />
      </button>

      {isEditing ? (
        <EmployeeEditForm
          employee={employee}
          onClose={() => setIsEditing(false)}
          onSave={(updated) => {
            onEdit(updated);
            setIsEditing(false);
          }}
        />
      ) : (
        <>
          {/* OLD PREVIEW UI */}
          <div className="flex items-center space-x-4 mb-6">
            {employee.avatar ? (
              <img src={employee.avatar} alt={employee.name} className="h-16 w-16 rounded-full object-cover" />
            ) : (
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-semibold">
                {employee.name.split(' ').map(n => n[0]).join('')}
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold text-gray-900">{employee.name}</h3>
              <p className="text-sm text-gray-500">{employee.position}</p>
            </div>
          </div>

          {/* contact info */}
          <div className="space-y-4 text-sm text-gray-600">
            <div><Building className="h-4 w-4 inline-block mr-2" />{employee.department}</div>
            <div><Mail className="h-4 w-4 inline-block mr-2" />{employee.email}</div>
            <div><Phone className="h-4 w-4 inline-block mr-2" />{employee.phone}</div>
            <div><Calendar className="h-4 w-4 inline-block mr-2" />{employee.startDate}</div>
          </div>

          <div className="mt-6 flex space-x-3">
            <button
              onClick={handleEditClick}
              className="flex-1 flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </button>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this employee?')) {
                  onDelete(employee.id);
                }
              }}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        </>
      )}
    </Dialog.Panel>
  </div>
</Dialog> )
};

export default EmployeeCard;