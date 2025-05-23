import { VisualField, OperatorOption } from './index.ts';

export const fieldMappings: VisualField[] = [
  {
    id: 'first_name',
    label: 'First Name',
    value: 'employees.first_name',
    type: 'string',
    table: 'employees'
  },
  {
    id: 'last_name',
    label: 'Last Name',
    value: 'employees.last_name',
    type: 'string',
    table: 'employees'
  },
  {
    id: 'age',
    label: 'Age',
    value: 'employees.age',
    type: 'number',
    table: 'employees'
  },
  {
    id: 'salary',
    label: 'Salary',
    value: 'employees.salary',
    type: 'number',
    table: 'employees'
  },
  {
    id: 'hire_date',
    label: 'Hire Date',
    value: 'employees.hire_date',
    type: 'date',
    table: 'employees'
  },
  {
    id: 'gender',
    label: 'Gender',
    value: 'genders.gender_name',
    type: 'string',
    table: 'genders',
    join: {
      from: 'employees.gender_id',
      to: 'genders.gender_id'
    }
  },
  {
    id: 'department',
    label: 'Department',
    value: 'departments.department_name',
    type: 'string',
    table: 'departments',
    join: {
      from: 'employees.department_id',
      to: 'departments.department_id'
    }
  },
  {
    id: 'job_title',
    label: 'Job Title',
    value: 'job_titles.title_name',
    type: 'string',
    table: 'job_titles',
    join: {
      from: 'employees.job_title_id',
      to: 'job_titles.job_title_id'
    }
  },
  {
    id: 'location',
    label: 'Location',
    value: 'locations.location_name',
    type: 'string',
    table: 'locations',
    join: {
      from: 'departments.location_id',
      to: 'locations.location_id'
    }
  },
  {
    id: 'country',
    label: 'Country',
    value: 'countries.country_name',
    type: 'string',
    table: 'countries',
    join: {
      from: 'locations.country_id',
      to: 'countries.country_id'
    }
  },
  {
    id: 'project_name',
    label: 'Project Name',
    value: 'projects.project_name',
    type: 'string',
    table: 'projects',
    join: {
      from: 'employee_projects.project_id',
      to: 'projects.project_id'
    }
  },
  {
    id: 'performance_rating',
    label: 'Performance Rating',
    value: 'performance_reviews.rating',
    type: 'number',
    table: 'performance_reviews',
    join: {
      from: 'employees.employee_id',
      to: 'performance_reviews.employee_id'
    }
  }
];

export const operatorOptions: OperatorOption[] = [
  {
    label: 'equals',
    value: '=',
    types: ['string', 'number', 'date'],
    needsValue: true
  },
  {
    label: 'does not equal',
    value: '!=',
    types: ['string', 'number', 'date'],
    needsValue: true
  },
  {
    label: 'is greater than',
    value: '>',
    types: ['number', 'date'],
    needsValue: true
  },
  {
    label: 'is less than',
    value: '<',
    types: ['number', 'date'],
    needsValue: true
  },
  {
    label: 'is greater than or equal to',
    value: '>=',
    types: ['number', 'date'],
    needsValue: true
  },
  {
    label: 'is less than or equal to',
    value: '<=',
    types: ['number', 'date'],
    needsValue: true
  },
  {
    label: 'contains',
    value: 'LIKE',
    types: ['string'],
    needsValue: true
  },
  {
    label: 'starts with',
    value: 'STARTS_WITH',
    types: ['string'],
    needsValue: true
  },
  {
    label: 'ends with',
    value: 'ENDS_WITH',
    types: ['string'],
    needsValue: true
  },
  {
    label: 'is in list',
    value: 'IN',
    types: ['string', 'number'],
    needsValue: true,
    multiple: true
  },
  {
    label: 'is not in list',
    value: 'NOT IN',
    types: ['string', 'number'],
    needsValue: true,
    multiple: true
  },
  {
    label: 'is empty',
    value: 'IS NULL',
    types: ['string', 'number', 'date'],
    needsValue: false
  },
  {
    label: 'is not empty',
    value: 'IS NOT NULL',
    types: ['string', 'number', 'date'],
    needsValue: false
  }
];

export const getOperatorsForFieldType = (type: 'string' | 'number' | 'date'): OperatorOption[] => {
  return operatorOptions.filter(op => op.types.includes(type));
};

export const getFieldsByTable = (): Record<string, VisualField[]> => {
  const fieldsByTable: Record<string, VisualField[]> = {};
  
  fieldMappings.forEach(field => {
    if (!fieldsByTable[field.table]) {
      fieldsByTable[field.table] = [];
    }
    fieldsByTable[field.table].push(field);
  });
  
  return fieldsByTable;
};