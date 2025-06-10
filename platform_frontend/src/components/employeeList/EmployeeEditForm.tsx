import React, { useState } from 'react';
import { Employee } from './employee';

interface Props {
  employee: Employee;
  onClose: () => void;
  onSave: (updated: Employee) => void;
}

const EmployeeEditForm: React.FC<Props> = ({ employee, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...employee });
  const [saving, setSaving] = useState(false);

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

  const handleChange = (field: keyof Employee, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);

      // фейковая задержка
      await new Promise(resolve => setTimeout(resolve, 300));

      // фейковое обновление только в UI
      onSave(formData);
      onClose();
    } catch (e) {
      alert('❌ Ошибка при обновлении (UI)');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Возраст</label>
        <input
          type="number"
          className="w-full border rounded-md p-2"
          value={formData.age}
          onChange={e => handleChange('age', +e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Образование (уровень)</label>
        <input
          type="number"
          className="w-full border rounded-md p-2"
          value={formData.education_level}
          onChange={e => handleChange('education_level', +e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Департамент</label>
        <select
          className="w-full border rounded-md p-2"
          value={formData.department}
          onChange={e => handleChange('department', e.target.value)}
        >
          {Object.keys(departmentMap).map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Должность</label>
        <select
          className="w-full border rounded-md p-2"
          value={formData.position}
          onChange={e => handleChange('position', e.target.value)}
        >
          {Object.keys(jobRoleMap).map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Уровень должности</label>
        <input
          type="number"
          className="w-full border rounded-md p-2"
          value={formData.job_level}
          onChange={e => handleChange('job_level', +e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Вовлеченность</label>
        <input
          type="number"
          className="w-full border rounded-md p-2"
          value={formData.job_involvement}
          onChange={e => handleChange('job_involvement', +e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Удовлетворенность</label>
        <input
          type="number"
          className="w-full border rounded-md p-2"
          value={formData.job_satisfaction}
          onChange={e => handleChange('job_satisfaction', +e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Оценка производительности</label>
        <input
          type="number"
          className="w-full border rounded-md p-2"
          value={formData.performance_rating}
          onChange={e => handleChange('performance_rating', +e.target.value)}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <button onClick={onClose} className="px-4 py-2 border rounded-md text-gray-600">
          Отмена
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
          disabled={saving}
        >
          {saving ? 'Сохраняем...' : 'Сохранить'}
        </button>
      </div>
    </div>
  );
};

export default EmployeeEditForm;
