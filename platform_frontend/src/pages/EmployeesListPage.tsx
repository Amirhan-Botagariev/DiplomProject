import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, ChevronDown, Plus } from 'lucide-react';
import { Employee, EmployeeFilters } from '../components/employeeList/employee.ts';
import EmployeeCard from '../components/employeeList/EmployeeCard.tsx';
import FilterDialog from '../components/employeeList/FilterDialog.tsx';
import EmployeeCreateModal from '../features/EmployeeModal/EmployeeCreateModal.tsx';
import Pagination from '../components/pagination/Pagination.tsx';

const EmployeesListPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<EmployeeFilters>({});
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [departments, setDepartments] = useState<string[]>([]);
  const url = import.meta.env.VITE_BACKEND_URL;
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 20;

  // Получаем список сотрудников с бэка
  useEffect(() => {
    const fetchEmployees = async () => {
      const params: any = {
        skip: (currentPage - 1) * limit,
        limit,
      };

      if (searchTerm) {
        params.name = searchTerm;
      }

      if (filters.department) params.department = filters.department;
      if (filters.status === 'active') params.attrition = false;
      if (filters.status === 'inactive') params.attrition = true;
      if (filters.sortBy) params.sort_by = filters.sortBy;
      if (filters.sortOrder) params.sort_order = filters.sortOrder;
      if (filters.gender) params.gender = filters.gender;
      if (filters.education_field) params.education_field = filters.education_field;
      if (filters.job_level) params.job_level = filters.job_level;
      if (filters.ageMin !== undefined) params.age_min = filters.ageMin;
      if (filters.ageMax !== undefined) params.age_max = filters.ageMax;
      if (filters.riskMin !== undefined) params.risk_min = filters.riskMin;
      if (filters.riskMax !== undefined) params.risk_max = filters.riskMax;

      try {
        const res = await axios.get(`${url}/api/v1/employees/`, { params });
        const rawEmployees = res.data.employees ?? [];
        const mappedEmployees = rawEmployees.map(mapEmployee);
        setEmployees(mappedEmployees);
        setTotalCount(res.data.total ?? 0);
      } catch (err) {
        console.error('Ошибка при загрузке сотрудников:', err);
      }
    };

    fetchEmployees();
  }, [filters, searchTerm, currentPage]);

  const mapEmployee = (raw: any): Employee => ({
    id: raw.employee_id,
    name: raw.full_name ?? '??',
    email: raw.email ?? '',
    phone: raw.phone ?? '',
    avatar: raw.avatar ?? null,
    position: raw.job_role ?? '',
    department: raw.department ?? '',
    status: raw.attrition ? 'inactive' : 'active',
    startDate: raw.review_date ?? '',
    age: raw.age,
    gender: raw.gender,
    marital_status: raw.marital_status,
    education_field: raw.education_field,
    education_level: raw.education_level,
    job_level: raw.job_level,
    job_involvement: raw.job_involvement,
    job_satisfaction: raw.job_satisfaction,
    performance_rating: raw.performance_rating,
    years_at_company: raw.years_at_company,
    risk: raw.risk,
  });

  useEffect(() => {
    axios.get(`${url}/api/v1/reference/departments/`).then(res => {
      setDepartments(res.data ?? []);
    });
  }, []);

  const handleEdit = (updatedEmployee: Employee) => {
    setEmployees(prev =>
      prev.map(emp => (emp.id === updatedEmployee.id ? updatedEmployee : emp))
    );
  };

  const handleDelete = (id: number) => {
    // ⚠️ Фейковое удаление: просто фильтруем локально
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  };

  const handleCreate = (newEmployee: Employee) => {
    setEmployees(prev => [newEmployee, ...prev]);
    setCreateModalOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Сотрудники</h1>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          onClick={() => setCreateModalOpen(true)}
        >
          <Plus className="h-5 w-5 mr-2" />
          Добавить сотрудника
        </button>
      </div>

      <EmployeeCreateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleCreate}
      />

      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Поиск сотрудника..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
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
                  {employee.name
                    ? employee.name.split(' ').map(n => n[0]).join('')
                    : '??'}
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
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    employee.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {employee.status}
                </span>
              </div>
              <div className="text-sm text-gray-500">{employee.email}</div>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalCount / limit)}
        onPageChange={setCurrentPage}
      />

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
