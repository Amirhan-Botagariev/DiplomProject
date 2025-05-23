import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import NotificationIcon from "../icons/notification-bell.svg?react";
import { Modal } from "../components/ui/modal";

interface RiskyEmployee {
  id: number;
  name: string;
  position: string;
  department: string;
  risk: number;
  reason: string;
  avatar_url?: string;
  age?: number;
  years_at_company?: number;
  years_in_current_role?: number;
  job_level?: string;
  num_companies_worked?: number;
  total_working_years?: number;
  work_life_balance?: string;
  training_times_last_year?: number;
  gender?: string;
  attrition?: boolean;
  marital_status?: string;
  education_level?: string;
  education_field?: string;
  education_field_name?: string;
  years_with_curr_manager?: number;
  years_since_last_promotion?: number;
  business_travel?: string;
  environment_satisfaction?: number;
  job_involvement?: number;
  job_satisfaction?: number;
  performance_rating?: number;
  relationship_satisfaction?: number;
}

const categoryConfig = {
  high: {
    title: "Сотрудники с высоким риском ухода",
    filter: (e: RiskyEmployee) => e.risk > 0.7,
    color: "text-red-600",
    badge: "Высокий",
    badgeColor: "bg-red-100 text-red-700"
  },
  medium: {
    title: "Сотрудники со средним риском ухода",
    filter: (e: RiskyEmployee) => e.risk > 0.4 && e.risk <= 0.7,
    color: "text-yellow-600",
    badge: "Средний",
    badgeColor: "bg-yellow-100 text-yellow-700"
  },
  low: {
    title: "Сотрудники с низким риском ухода",
    filter: (e: RiskyEmployee) => e.risk <= 0.4,
    color: "text-green-600",
    badge: "Низкий",
    badgeColor: "bg-green-100 text-green-700"
  },
};

type CategoryKey = keyof typeof categoryConfig;

export default function RiskCategoryPage() {
  const { category } = useParams<{ category: CategoryKey }>();
  const [employees, setEmployees] = useState<RiskyEmployee[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<RiskyEmployee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (emp: RiskyEmployee) => {
    setSelectedEmployee(emp);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/employees/attrition_risk`);
        const data = await res.json();
        const employeesArr = Array.isArray(data.employees) ? data.employees : [];
        const filteredData = employeesArr.filter(emp => !emp.attrition);
        setEmployees(filteredData);
        setTotalCount(filteredData.length);
      } catch (e) {
        setEmployees([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (!category || !(category in categoryConfig)) {
    return <div>Категория не найдена</div>;
  }

  const config = categoryConfig[category];
  const filtered = employees.filter(config.filter);

  // Аналитика
  const avgRisk = filtered.length ? (filtered.reduce((sum, e) => sum + e.risk, 0) / filtered.length) : 0;
  const avgYears = filtered.length && filtered[0].hasOwnProperty('years_at_company') ?
    (filtered.reduce((sum, e: any) => sum + (e.years_at_company || 0), 0) / filtered.length) : null;
  const maleCount = filtered.filter((e: any) => e.gender === 'Male' || e.gender === 'Мужчина').length;
  const femaleCount = filtered.filter((e: any) => e.gender === 'Female' || e.gender === 'Женщина').length;

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F8F8] p-8">
      <div className="flex items-center mb-6">
        <div className="text-2xl font-bold text-blue-900 mr-4">{categoryConfig[category].title}</div>
        <span className="ml-auto text-sm text-gray-500">Всего: {totalCount}</span>
      </div>
      <Link
        to="/notifications"
        className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-900 font-semibold shadow transition-all text-base mb-4 focus:outline-none focus:ring-2 focus:ring-blue-200"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        Назад к уведомлениям
      </Link>
      {loading ? (
        <div>Загрузка...</div>
      ) : (
        <>
        <div className="mb-6 bg-white rounded shadow p-4 flex flex-col md:flex-row gap-4">
          <div>Всего сотрудников: <b>{filtered.length}</b></div>
          <div>Средний риск: <b>{(avgRisk * 100).toFixed(1)}%</b></div>
          {avgYears !== null && <div>Средний стаж: <b>{avgYears.toFixed(1)} лет</b></div>}
          <div>Мужчин: <b>{maleCount}</b></div>
          <div>Женщин: <b>{femaleCount}</b></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((emp) => (
            <Card key={emp.id} className="flex flex-col p-4 bg-white shadow rounded-lg border border-blue-100">
              <CardContent className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                  {emp.avatar_url ? (
                    <img src={emp.avatar_url} alt={emp.name} className="w-16 h-16 rounded-full object-cover" />
                  ) : (
                    <span className="text-3xl font-bold text-blue-500">{emp.employee_number ? emp.employee_number[0] : '?'}</span>
                  )}
                </div>
                <div className="text-lg font-semibold mb-1">{emp.name}</div>
                <div className="text-sm text-gray-500 mb-2">{emp.position}, {emp.department}</div>
                <div className="flex items-center mb-2">
                  <span className={`font-bold mr-2 ${emp.risk >= 0.7 ? 'text-red-600' : emp.risk >= 0.4 ? 'text-yellow-500' : 'text-green-600'}`}>Риск: {(emp.risk * 100).toFixed(0)}%</span>
                  <span className={`px-2 py-1 rounded text-xs ml-1 ${config.badgeColor}`}>{config.badge}</span>
                </div>
                <div className="text-xs text-gray-400 mb-2">{emp.reason}</div>
                <button className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition" onClick={() => handleOpenModal(emp)}>
                  Подробнее
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          {selectedEmployee && (
            <div className="bg-white rounded-2xl shadow-2xl mx-auto w-full max-w-xl md:max-w-2xl p-0 flex flex-col items-center justify-center" style={{ minWidth: 0 }}>
              <div className="w-full flex items-center justify-between px-8 pt-7 pb-2 border-b border-blue-100">
                <span className="text-2xl font-bold text-blue-900">Анкета сотрудника</span>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-blue-500 text-2xl leading-none">&times;</button>
              </div>
              {(() => {
                // Формируем массив всех отображаемых полей анкеты
                const fields = [
                  {
                    label: 'Возраст',
                    value: selectedEmployee.age ?? '-',
                  },
                  {
                    label: 'Пол',
                    value: selectedEmployee.gender ?? '-',
                  },
                  {
                    label: 'Семейное положение',
                    value: selectedEmployee.marital_status ?? '-',
                  },
                  {
                    label: 'Уровень образования',
                    value: (() => {
                      const map = {1:'Below College',2:'College',3:'Bachelor',4:'Master',5:'Doctor'};
                      const val = selectedEmployee.education_level;
                      return val && map[val] ? map[val] : val ?? '-';
                    })(),
                  },
                  {
                    label: 'Специальность образования',
                    value: selectedEmployee.education_field_name ?? selectedEmployee.education_field ?? '-',
                  },
                  {
                    label: 'Стаж в компании',
                    value: selectedEmployee.years_at_company ?? '-',
                  },
                  {
                    label: 'Стаж в роли',
                    value: selectedEmployee.years_in_current_role ?? '-',
                  },
                  {
                    label: 'Стаж с руководителем',
                    value: selectedEmployee.years_with_curr_manager ?? '-',
                  },
                  {
                    label: 'Стаж с последнего повышения',
                    value: selectedEmployee.years_since_last_promotion ?? '-',
                  },
                  {
                    label: 'Уровень должности',
                    value: selectedEmployee.job_level ?? '-',
                  },
                  {
                    label: 'Работал в компаниях',
                    value: selectedEmployee.num_companies_worked ?? '-',
                  },
                  {
                    label: 'Общий стаж',
                    value: selectedEmployee.total_working_years ?? '-',
                  },
                  {
                    label: 'Work-Life Balance',
                    value: (() => {
                      const map = {1:'Bad',2:'Good',3:'Better',4:'Best'};
                      const val = selectedEmployee.work_life_balance;
                      return val && map[val] ? map[val] : val ?? '-';
                    })(),
                  },
                  {
                    label: 'Тренингов/год',
                    value: selectedEmployee.training_times_last_year ?? '-',
                  },
                  {
                    label: 'Тип командировок',
                    value: selectedEmployee.business_travel ?? '-',
                  },
                  // Дополнительные поля с маппингом
                  selectedEmployee.environment_satisfaction !== undefined && {
                    label: 'Удовлетворённость рабочей средой',
                    value: (() => {
                      const map = {1:'Low',2:'Medium',3:'High',4:'Very High'};
                      const val = selectedEmployee.environment_satisfaction;
                      return val && map[val] ? map[val] : val ?? '-';
                    })(),
                  },
                  selectedEmployee.job_involvement !== undefined && {
                    label: 'Вовлечённость в работу',
                    value: (() => {
                      const map = {1:'Low',2:'Medium',3:'High',4:'Very High'};
                      const val = selectedEmployee.job_involvement;
                      return val && map[val] ? map[val] : val ?? '-';
                    })(),
                  },
                  selectedEmployee.job_satisfaction !== undefined && {
                    label: 'Удовлетворённость работой',
                    value: (() => {
                      const map = {1:'Low',2:'Medium',3:'High',4:'Very High'};
                      const val = selectedEmployee.job_satisfaction;
                      return val && map[val] ? map[val] : val ?? '-';
                    })(),
                  },
                  selectedEmployee.performance_rating !== undefined && {
                    label: 'Оценка эффективности',
                    value: (() => {
                      const map = {1:'Low',2:'Good',3:'Excellent',4:'Outstanding'};
                      const val = selectedEmployee.performance_rating;
                      return val && map[val] ? map[val] : val ?? '-';
                    })(),
                  },
                  selectedEmployee.relationship_satisfaction !== undefined && {
                    label: 'Удовлетворённость отношениями',
                    value: (() => {
                      const map = {1:'Low',2:'Medium',3:'High',4:'Very High'};
                      const val = selectedEmployee.relationship_satisfaction;
                      return val && map[val] ? map[val] : val ?? '-';
                    })(),
                  },
                  {
                    label: 'Уволился',
                    value: selectedEmployee.attrition ? 'Да' : 'Нет',
                  },
                ].filter(Boolean);
                // Делим на две колонки
                const mid = Math.ceil(fields.length / 2);
                const left = fields.slice(0, mid);
                const right = fields.slice(mid);
                return (
                  <div className="px-8 py-7 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                    <div>
                      {left.map((f, i) => (
                        <div className="mb-3" key={i}>
                          <label className="block text-xs text-gray-500 mb-0.5">{f.label}</label>
                          <div className="bg-blue-50 rounded px-3 py-1 text-base font-medium text-gray-900">{f.value}</div>
                        </div>
                      ))}
                    </div>
                    <div>
                      {right.map((f, i) => (
                        <div className="mb-3" key={i}>
                          <label className="block text-xs text-gray-500 mb-0.5">{f.label}</label>
                          <div className="bg-blue-50 rounded px-3 py-1 text-base font-medium text-gray-900">{f.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
              <div className="flex items-center justify-center pb-7 pt-2 w-full">
                <span className={`px-6 py-2 rounded-full text-base font-semibold shadow-md ${selectedEmployee.risk >= 0.7 ? 'bg-red-100 text-red-600' : selectedEmployee.risk >= 0.4 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{selectedEmployee.risk >= 0.7 ? 'Высокий риск' : selectedEmployee.risk >= 0.4 ? 'Средний риск' : 'Низкий риск'} • {(selectedEmployee.risk * 100).toFixed(0)}%</span>
              </div>
            </div>
          )}
        </Modal>
        </>
      )}
    </div>
  );
}
