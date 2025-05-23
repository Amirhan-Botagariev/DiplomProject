export interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  status: 'active' | 'inactive';
  startDate: string;
  avatar?: string;
}

export interface EmployeeFilters {
  department?: string;
  status?: 'active' | 'inactive';
  sortBy?: 'name' | 'age' | 'startDate' | 'position';
  sortOrder?: 'asc' | 'desc';
}