import React, { useState } from 'react';
import axios from 'axios';
import { Employee } from './employee';

interface Props {
  employee: Employee;
  onClose: () => void;
  onSave: (updated: Employee) => void;
}

const EmployeeEditForm: React.FC<Props> = ({ employee, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...employee });
  const [saving, setSaving] = useState(false);

  const handleChange = (field: keyof Employee, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      const res = await axios.patch(`/api/v1/employees/${employee.id}`, formData);
      onSave(res.data); // обновим список на фронте
      onClose();
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          type="text"
          className="w-full border rounded-md p-2"
          value={formData.name}
          onChange={e => handleChange('name', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          className="w-full border rounded-md p-2"
          value={formData.email}
          onChange={e => handleChange('email', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Phone</label>
        <input
          type="text"
          className="w-full border rounded-md p-2"
          value={formData.phone}
          onChange={e => handleChange('phone', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Position</label>
        <input
          type="text"
          className="w-full border rounded-md p-2"
          value={formData.position}
          onChange={e => handleChange('position', e.target.value)}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <button onClick={onClose} className="px-4 py-2 text-gray-700 border rounded-md">
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default EmployeeEditForm;
