import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, CircularProgress, Box, Select, MenuItem, FormControl, InputLabel, TableSortLabel, Popover, Button, IconButton } from "@mui/material";
import { genderMap, maritalStatusMap, educationLevelMap, educationFieldMap, departmentMap, performanceRatingMap, jobRoleMap, getMaritalStatusRu } from "../lib/translations";

interface Employee {
  employee_id: number;
  employee_number: number;
  age: number;
  gender_id: number | null;
  marital_status_id: number | null;
  education_level: number;
  education_field_id: number | null;
  department_id: number | null;
  job_role_id: number | null;
  job_level: number;
  attrition: boolean;
  business_travel_id: number | null;
  num_companies_worked: number;
  total_working_years: number;
  years_at_company: number;
  years_in_current_role: number;
  years_since_last_promotion: number;
  years_with_curr_manager: number;
  work_life_balance: number;
  training_times_last_year: number;
  created_at: string;
  updated_at: string;
  department: string;
  job_role: string;
  gender: string;
  education_field: string;
  marital_status: string;
  business_travel: string;
  performance_rating?: number;
  job_involvement?: number;
  job_satisfaction?: number;
  relationship_satisfaction?: number;
  environment_satisfaction?: number;
  review_date?: string;
  risk?: number;
}

const PAGE_SIZE = 10;

const columns = [
  { key: "employee_id", label: "ID", sortable: false },
  { key: "age", label: "Возраст", sortable: true },
  { key: "gender", label: "Пол", render: (emp: Employee) => genderMap[emp.gender] || emp.gender },
  { key: "marital_status", label: "Семейное положение", render: (emp: Employee) => getMaritalStatusRu(emp.marital_status, emp.gender) },
  { key: "education_level", label: "Образование (уровень)", sortable: true, render: (emp: Employee) => educationLevelMap[emp.education_level] || emp.education_level },
  { key: "education_field", label: "Образование (направление)", render: (emp: Employee) => educationFieldMap[emp.education_field] || emp.education_field },
  { key: "department", label: "Департамент", sortable: true, render: (emp: Employee) => departmentMap[emp.department] || emp.department },
  { key: "job_role", label: "Должность", sortable: true, render: (emp: Employee) => jobRoleMap[emp.job_role] || emp.job_role },
  { key: "attrition", label: "Уволен?", sortable: true, render: (emp: Employee) => emp.attrition ? "Да" : "Нет" },
  { key: "years_at_company", label: "Стаж в компании (лет)", sortable: true },
  { key: "performance_rating", label: "Оценка эффективности", render: (emp: Employee) => performanceRatingMap[emp.performance_rating ?? 0] || emp.performance_rating },
  { key: "risk", label: "Риск увольнения (%)", sortable: true, render: (emp: Employee) => emp.risk !== undefined && emp.risk !== null ? emp.risk.toFixed(1) + ' %' : '' },
];

const EmployeesListPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  // --- Справочные состояния для фильтров ---
  const [departments, setDepartments] = useState<string[]>([]);
  const [jobRoles, setJobRoles] = useState<string[]>([]);
  const [educationFields, setEducationFields] = useState<string[]>([]);
  const [genders, setGenders] = useState<string[]>([]);
  const [maritalStatuses, setMaritalStatuses] = useState<string[]>([]);
  const initialFilterState = {
    employee_id: '',
    age_min: '',
    age_max: '',
    gender: '',
    marital_status: '',
    education_level: '',
    education_field: '',
    department: '',
    job_role: '',
    attrition: '',
    years_at_company_min: '',
    years_at_company_max: '',
    performance_rating: '',
    risk_min: '',
    risk_max: '',
  };
  const [filters, setFilters] = useState(initialFilterState);
  const [filterPopover, setFilterPopover] = useState<{ anchor: HTMLElement | null, col: string | null }>({ anchor: null, col: null });
  const [filterDraft, setFilterDraft] = useState<any>({});
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [headerAnchorEl, setHeaderAnchorEl] = useState<null | HTMLElement>(null);
  const [headerMenuCol, setHeaderMenuCol] = useState<string | null>(null);
  const [ageFilter, setAgeFilter] = useState({ min: '', max: '' });

  // --- Получение справочников с бэка ---
  useEffect(() => {
    axios.get('/api/v1/employees/departments/').then(res => setDepartments(res.data ?? []));
    axios.get('/api/v1/employees/job_roles/').then(res => setJobRoles(res.data ?? []));
    axios.get('/api/v1/employees/education_fields/').then(res => setEducationFields(res.data ?? []));
    axios.get('/api/v1/employees/genders/').then(res => setGenders(res.data ?? []));
    axios.get('/api/v1/employees/marital_statuses/').then(res => setMaritalStatuses(res.data ?? []));
  }, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const params: any = {
          skip: (page - 1) * PAGE_SIZE,
          limit: PAGE_SIZE,
        };
        // Передаем все фильтры, если они заданы
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== '' && value !== undefined && value !== null) {
            params[key] = value;
          }
        });
        if (sortBy) params.sort_by = sortBy;
        if (sortOrder) params.sort_order = sortOrder;
        const res = await axios.get(`/api/v1/employees/`, { params });
        setEmployees(res.data.employees ?? []);
        setTotal(res.data.total ?? 0);
      } catch (e) {
        setEmployees([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, [page, filters, sortBy, sortOrder]);

  const handleFilterChange = (field: string, value: string) => {
    setPage(1);
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(o => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleHeaderClick = (colKey: string) => (event: React.MouseEvent<HTMLElement>) => {
    setHeaderAnchorEl(event.currentTarget);
    setHeaderMenuCol(colKey);
  };
  const handleCloseHeaderMenu = () => {
    setHeaderAnchorEl(null);
    setHeaderMenuCol(null);
  };

  const handleSortAsc = () => {
    if (headerMenuCol) {
      setSortBy(headerMenuCol);
      setSortOrder('asc');
      setPage(1);
    }
    handleCloseHeaderMenu();
  };
  const handleSortDesc = () => {
    if (headerMenuCol) {
      setSortBy(headerMenuCol);
      setSortOrder('desc');
      setPage(1);
    }
    handleCloseHeaderMenu();
  };

  const handleApplyHeaderFilter = () => {
    if (headerMenuCol === 'age') {
      setFilters(prev => ({ ...prev, age_min: ageFilter.min, age_max: ageFilter.max }));
      setPage(1);
    }
    handleCloseHeaderMenu();
  };
  const handleResetHeaderFilter = () => {
    if (headerMenuCol === 'age') {
      setAgeFilter({ min: '', max: '' });
      setFilters(prev => ({ ...prev, age_min: '', age_max: '' }));
      setPage(1);
    }
    handleCloseHeaderMenu();
  };

  const openFilterPopover = (col: string) => (event: React.MouseEvent<HTMLElement>) => {
    setFilterPopover({ anchor: event.currentTarget, col });
    setFilterDraft({ ...filters });
  };
  const closeFilterPopover = () => {
    setFilterPopover({ anchor: null, col: null });
  };
  const applyFilterPopover = () => {
    setFilters({ ...filterDraft });
    setPage(1);
    closeFilterPopover();
  };
  const resetFilterPopover = () => {
    setFilterDraft({ ...initialFilterState });
  };

  return (
    <Box p={2}>
      <h2>Список сотрудников</h2>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {columns.map(col => (
                    <TableCell key={col.key}>
                      <Box display="flex" alignItems="center" flexDirection="column" alignItems="flex-start">
                        <span
                          style={{ cursor: 'pointer', fontWeight: 'bold', userSelect: 'none' }}
                          onClick={openFilterPopover(col.key)}
                        >
                          {col.label}
                        </span>
                        <span style={{ fontSize: 11, color: '#888', marginTop: 2 }}>
                          {(() => {
                            const val = filters[col.key + (col.key === 'age' ? '_min' : '')] !== undefined
                              ? filters[col.key + (col.key === 'age' ? '_min' : '')]
                              : filters[col.key];
                            if (col.key === 'age') {
                              const min = filters.age_min;
                              const max = filters.age_max;
                              if (min || max) return `${min || ''}${min && max ? '–' : ''}${max || ''}`;
                              return 'Все';
                            }
                            if (col.key === 'years_at_company') {
                              const min = filters.years_at_company_min;
                              const max = filters.years_at_company_max;
                              if (min || max) return `${min || ''}${min && max ? '–' : ''}${max || ''}`;
                              return 'Все';
                            }
                            if (col.key === 'risk') {
                              const min = filters.risk_min;
                              const max = filters.risk_max;
                              if (min || max) return `${min || ''}${min && max ? '–' : ''}${max || ''}`;
                              return 'Все';
                            }
                            if (val && val !== '') {
                              // Для справочников показываем человеко-понятное значение
                              if (col.key === 'gender') return genderMap[val] || val;
                              if (col.key === 'marital_status') return maritalStatusMap[val] || val;
                              if (col.key === 'education_level') return educationLevelMap[val] || val;
                              if (col.key === 'education_field') return educationFieldMap[val] || val;
                              if (col.key === 'department') return departmentMap[val] || val;
                              if (col.key === 'job_role') return jobRoleMap[val] || val;
                              if (col.key === 'performance_rating') return performanceRatingMap[val] || val;
                              if (col.key === 'attrition') return val === 'true' ? 'Да' : 'Нет';
                              return val;
                            }
                            return 'Все';
                          })()}
                        </span>
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((emp) => (
                  <TableRow key={emp.employee_id}>
                    {columns.map(col => (
                      <TableCell key={col.key}>
                        {col.render ? col.render(emp) : (emp[col.key as keyof Employee] ?? "")}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={total}
            page={page - 1}
            onPageChange={(e, newPage) => setPage(newPage + 1)}
            rowsPerPage={PAGE_SIZE}
            rowsPerPageOptions={[PAGE_SIZE]}
          />
          <Popover
            open={Boolean(filterPopover.anchor)}
            anchorEl={filterPopover.anchor}
            onClose={closeFilterPopover}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Box p={2} display="flex" flexDirection="column" gap={1} minWidth={220}>
              {/* Сортировка для id, age, years_at_company, risk */}
              {['employee_id', 'age', 'years_at_company', 'risk'].includes(filterPopover.col || '') && (
                <Box display="flex" gap={1} mb={1}>
                  <Button
                    size="small"
                    variant={sortBy === filterPopover.col && sortOrder === 'asc' ? 'contained' : 'outlined'}
                    onClick={() => {
                      setSortBy(filterPopover.col!);
                      setSortOrder('asc');
                      setPage(1);
                      closeFilterPopover();
                    }}
                  >
                    Сортировать ↑
                  </Button>
                  <Button
                    size="small"
                    variant={sortBy === filterPopover.col && sortOrder === 'desc' ? 'contained' : 'outlined'}
                    onClick={() => {
                      setSortBy(filterPopover.col!);
                      setSortOrder('desc');
                      setPage(1);
                      closeFilterPopover();
                    }}
                  >
                    Сортировать ↓
                  </Button>
                </Box>
              )}
              {(() => {
                switch (filterPopover.col) {
                  case 'age':
                    return <>
                      <Box fontSize={14} mb={1}>Фильтр по возрасту</Box>
                      <Box display="flex" gap={1} alignItems="center">
                        <InputLabel shrink>от</InputLabel>
                        <input type="number" value={filterDraft.age_min} min={0} style={{ width: 60 }} onChange={e => setFilterDraft((f: any) => ({ ...f, age_min: e.target.value }))} />
                        <InputLabel shrink>до</InputLabel>
                        <input type="number" value={filterDraft.age_max} min={0} style={{ width: 60 }} onChange={e => setFilterDraft((f: any) => ({ ...f, age_max: e.target.value }))} />
                      </Box>
                    </>;
                  case 'years_at_company':
                    return <>
                      <Box fontSize={14} mb={1}>Фильтр по стажу</Box>
                      <Box display="flex" gap={1} alignItems="center">
                        <InputLabel shrink>от</InputLabel>
                        <input type="number" value={filterDraft.years_at_company_min} min={0} style={{ width: 60 }} onChange={e => setFilterDraft((f: any) => ({ ...f, years_at_company_min: e.target.value }))} />
                        <InputLabel shrink>до</InputLabel>
                        <input type="number" value={filterDraft.years_at_company_max} min={0} style={{ width: 60 }} onChange={e => setFilterDraft((f: any) => ({ ...f, years_at_company_max: e.target.value }))} />
                      </Box>
                    </>;
                  case 'risk':
                    return <>
                      <Box fontSize={14} mb={1}>Риск увольнения (%)</Box>
                      <Box display="flex" gap={1} alignItems="center">
                        <InputLabel shrink>от</InputLabel>
                        <input type="number" value={filterDraft.risk_min} min={0} max={100} style={{ width: 60 }} onChange={e => setFilterDraft((f: any) => ({ ...f, risk_min: e.target.value }))} />
                        <InputLabel shrink>до</InputLabel>
                        <input type="number" value={filterDraft.risk_max} min={0} max={100} style={{ width: 60 }} onChange={e => setFilterDraft((f: any) => ({ ...f, risk_max: e.target.value }))} />
                      </Box>
                    </>;
                  case 'gender':
                    return <>
                      <Box fontSize={14} mb={1}>Фильтр по полу</Box>
                      <Select size="small" value={filterDraft.gender} onChange={e => setFilterDraft((f: any) => ({ ...f, gender: e.target.value }))}>
                        <MenuItem value="">Все</MenuItem>
                        {genders.map(g => (
                          <MenuItem key={g} value={g}>{genderMap[g] || g}</MenuItem>
                        ))}
                      </Select>
                    </>;
                  case 'marital_status':
                    return <>
                      <Box fontSize={14} mb={1}>Семейное положение</Box>
                      <Select size="small" value={filterDraft.marital_status} onChange={e => setFilterDraft((f: any) => ({ ...f, marital_status: e.target.value }))}>
                        <MenuItem value="">Все</MenuItem>
                        {maritalStatuses.map(status => (
                          <MenuItem key={status} value={status}>{maritalStatusMap[status] || status}</MenuItem>
                        ))}
                      </Select>
                    </>;
                  case 'education_level':
                    return <>
                      <Box fontSize={14} mb={1}>Уровень образования</Box>
                      <Select size="small" value={filterDraft.education_level} onChange={e => setFilterDraft((f: any) => ({ ...f, education_level: e.target.value }))}>
                        <MenuItem value="">Все</MenuItem>
                        {Object.entries(educationLevelMap).map(([k, v]) => (
                          <MenuItem key={k} value={k}>{v}</MenuItem>
                        ))}
                      </Select>
                    </>;
                  case 'education_field':
                    return <>
                      <Box fontSize={14} mb={1}>Направление образования</Box>
                      <Select size="small" value={filterDraft.education_field} onChange={e => setFilterDraft((f: any) => ({ ...f, education_field: e.target.value }))}>
                        <MenuItem value="">Все</MenuItem>
                        {educationFields.map(field => (
                          <MenuItem key={field} value={field}>{educationFieldMap[field] || field}</MenuItem>
                        ))}
                      </Select>
                    </>;
                  case 'department':
                    return <>
                      <Box fontSize={14} mb={1}>Департамент</Box>
                      <Select size="small" value={filterDraft.department} onChange={e => setFilterDraft((f: any) => ({ ...f, department: e.target.value }))}>
                        <MenuItem value="">Все</MenuItem>
                        {departments.map(dep => (
                          <MenuItem key={dep} value={dep}>{departmentMap[dep] || dep}</MenuItem>
                        ))}
                      </Select>
                    </>;
                  case 'job_role':
                    return <>
                      <Box fontSize={14} mb={1}>Должность</Box>
                      <Select size="small" value={filterDraft.job_role} onChange={e => setFilterDraft((f: any) => ({ ...f, job_role: e.target.value }))}>
                        <MenuItem value="">Все</MenuItem>
                        {jobRoles.map(role => (
                          <MenuItem key={role} value={role}>{jobRoleMap[role] || role}</MenuItem>
                        ))}
                      </Select>
                    </>;
                  case 'attrition':
                    return <>
                      <Box fontSize={14} mb={1}>Уволен?</Box>
                      <Select size="small" value={filterDraft.attrition} onChange={e => setFilterDraft((f: any) => ({ ...f, attrition: e.target.value }))}>
                        <MenuItem value="">Все</MenuItem>
                        <MenuItem value="true">Да</MenuItem>
                        <MenuItem value="false">Нет</MenuItem>
                      </Select>
                    </>;
                  case 'performance_rating':
                    return <>
                      <Box fontSize={14} mb={1}>Оценка эффективности</Box>
                      <Select size="small" value={filterDraft.performance_rating} onChange={e => setFilterDraft((f: any) => ({ ...f, performance_rating: e.target.value }))}>
                        <MenuItem value="">Все</MenuItem>
                        {Object.entries(performanceRatingMap).map(([k, v]) => (
                          <MenuItem key={k} value={k}>{v}</MenuItem>
                        ))}
                      </Select>
                    </>;
                  default:
                    return <Box>Нет фильтра</Box>;
                }
              })()}
              <Box display="flex" gap={1} mt={2}>
                <Button size="small" variant="contained" onClick={applyFilterPopover}>Применить</Button>
                <Button size="small" onClick={resetFilterPopover}>Сбросить</Button>
              </Box>
            </Box>
          </Popover>
        </>
      )}
    </Box>
  );
};

export default EmployeesListPage;