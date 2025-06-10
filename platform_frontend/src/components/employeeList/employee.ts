export interface Employee {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  department: string;
  position: string;
  status: 'active' | 'inactive';
  startDate?: string;
  avatar?: string | null;

  age?: number;
  gender?: string;
  marital_status?: string;
  education_field?: string;
  education_level?: number;
  job_level?: number;
  job_involvement?: number;
  job_satisfaction?: number;
  performance_rating?: number;
  years_at_company?: number;
  risk?: number;
  total_working_years?: number;
}

export interface EmployeeFilters {
  department?: string;
  status?: 'active' | 'inactive';
  sortBy?: 'name' | 'age' | 'startDate' | 'position';
  sortOrder?: 'asc' | 'desc';

  gender?: string;
  education_field?: string;
  job_level?: number;
  ageMin?: number;
  ageMax?: number;
  riskMin?: number;
  riskMax?: number;
}