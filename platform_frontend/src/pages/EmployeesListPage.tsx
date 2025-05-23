import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, ChevronDown, Plus } from 'lucide-react';
import { Employee, EmployeeFilters } from '../components/employeeList/employee.ts';
import EmployeeCard from '../components/employeeList/EmployeeCard.tsx';
import FilterDialog from '../components/employeeList/FilterDialog.tsx';

const EmployeesListPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<EmployeeFilters>({});
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [departments, setDepartments] = useState<string[]>([]);

  // Получаем список сотрудников с бэка
  useEffect(() => {
    const fetchEmployees = async () => {
      const params: any = {
        skip: 0,
        limit: 100,
      };

      // Поиск
      if (searchTerm) {
        params.name = searchTerm;
      }

      // Фильтры
      if (filters.department) params.department = filters.department;
      if (filters.status) params.attrition = filters.status === 'inactive';
      if (filters.sortBy) params.sort_by = filters.sortBy;
      if (filters.sortOrder) params.sort_order = filters.sortOrder;

      try {
        const res = await axios.get('/api/v1/employees/', { params });
        setEmployees(res.data.employees ?? []);
      } catch (err) {
        console.error('Ошибка при загрузке сотрудников:', err);
      }
    };

    fetchEmployees();
  }, [filters, searchTerm]);

  // Загружаем список департаментов
  useEffect(() => {
    axios.get('/api/v1/employees/departments/').then(res => {
      setDepartments(res.data ?? []);
    });
  }, []);

  const handleEdit = (employee: Employee) => {
    console.log('Edit employee:', employee);
    // TODO: Реализовать редактирование
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/v1/employees/${id}`);
      setEmployees(prev => prev.filter(e => e.id !== id));
      setSelectedEmployee(null);
    } catch (error) {
      console.error('Не удалось удалить сотрудника:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Employees</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Add Employee
        </button>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search employees..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          onClick={() => setIsFilterDialogOpen(true)}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
        >
          <Filter className="h-5 w-5 mr-2" />
          Filters
          <ChevronDown className="h-4 w-4 ml-2" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {employees.map(employee => (
          <div
            key={employee.id}
            onClick={() => setSelectedEmployee(employee)}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              {employee.avatar ? (
                <img
                  src={employee.avatar}
                  alt={employee.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                  {employee.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}
              <div>
                <h3 className="font-medium text-gray-900">{employee.name}</h3>
                <p className="text-sm text-gray-500">{employee.position}</p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{employee.department}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  employee.status === 'active' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {employee.status}
                </span>
              </div>
              <div className="text-sm text-gray-500">{employee.email}</div>
            </div>
          </div>
        ))}
      </div>

      {selectedEmployee && (
        <EmployeeCard
          employee={selectedEmployee}
          isOpen={true}
          onClose={() => setSelectedEmployee(null)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <FilterDialog
        isOpen={isFilterDialogOpen}
        onClose={() => setIsFilterDialogOpen(false)}
        filters={filters}
        onApplyFilters={setFilters}
        departments={departments}
      />
    </div>
  );
};

export default EmployeesListPage;
