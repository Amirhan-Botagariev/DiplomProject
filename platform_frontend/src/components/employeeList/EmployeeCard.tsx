import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import {
  Mail,
  Phone,
  Calendar,
  Building,
  Briefcase,
  X,
  Edit2,
  Trash2
} from 'lucide-react';
import { Employee } from './employee';
import EmployeeEditForm from './EmployeeEditForm';

interface EmployeeCardProps {
  employee: Employee;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (employee: Employee) => void;
  onDelete: (id: number) => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  isOpen,
  onClose,
  onEdit,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => setIsEditing(true);

  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить сотрудника?')) {
      onDelete(employee.id);
      onClose(); // закрыть карточку после удаления
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
              <div className="flex items-center space-x-4 mb-6">
                {employee.avatar ? (
                  <img
                    src={employee.avatar}
                    alt={employee.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-semibold"
                  >
                    {employee.name?.split(' ').map((n) => n[0]).join('') || '??'}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{employee.name}</h3>
                  <p className="text-sm text-gray-500">{employee.position}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <div><Building className="h-4 w-4 inline-block mr-2" />{employee.department}</div>
                <div><Mail className="h-4 w-4 inline-block mr-2" />{employee.email || <span className="text-gray-400">нет email</span>}</div>
                <div><Phone className="h-4 w-4 inline-block mr-2" />{employee.phone || <span className="text-gray-400">нет телефона</span>}</div>
                <div><Calendar className="h-4 w-4 inline-block mr-2" />{employee.startDate || <span className="text-gray-400">не указана дата</span>}</div>
                <div>
                  <Briefcase className="h-4 w-4 inline-block mr-2" />
                  Статус:{' '}
                  <span className={`ml-1 font-medium ${employee.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                    {employee.status === 'active' ? 'Активен' : 'Уволен'}
                  </span>
                </div>
              </div>

              <div className="mt-6 border-t pt-4 space-y-2 text-sm text-gray-700">
                <div><strong>Пол:</strong> {employee.gender}</div>
                <div><strong>Возраст:</strong> {employee.age}</div>
                <div><strong>Семейное положение:</strong> {employee.marital_status}</div>
                <div><strong>Образование:</strong> {employee.education_field} (Уровень {employee.education_level})</div>
                <div><strong>Опыт работы:</strong> {employee.total_working_years || 1} лет</div>
                <div><strong>Лет в компании:</strong> {employee.years_at_company}</div>
                <div><strong>Уровень должности:</strong> {employee.job_level}</div>
                <div><strong>Вовлеченность:</strong> {employee.job_involvement}/4</div>
                <div><strong>Удовлетворенность работой:</strong> {employee.job_satisfaction}/4</div>
                <div><strong>Оценка производительности:</strong> {employee.performance_rating}/5</div>
                <div><strong>Риск увольнения:</strong> {employee.risk != null ? `${(employee.risk * 100).toFixed(1)}%` : '—'}</div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button
                  onClick={handleEditClick}
                  className="flex-1 flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Редактировать
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Удалить
                </button>
              </div>
            </>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default EmployeeCard;