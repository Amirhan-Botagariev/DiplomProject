import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import NotificationIcon from "../icons/notification-bell.svg?react";
import { useNavigate } from "react-router-dom";
import { Modal } from "../components/ui/modal";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface RiskyEmployee {
  id: number;
  name: string;
  position: string;
  department: string;
  risk: number;
  reason: string;
  avatar_url?: string;
  years_at_company?: number;
  gender?: string;
  age?: number;
  attrition?: boolean;
}

export default function NotificationsPage() {
  const [employees, setEmployees] = useState<RiskyEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchRiskyEmployees() {
      try {
        const res = await fetch(`/api/v1/employees/attrition_risk`);
        const data = await res.json();
        // Берём массив сотрудников из data.employees
        const employeesArr = Array.isArray(data.employees) ? data.employees : [];
        // Удаляем нормализацию risk на 100, теперь risk уже в диапазоне 0–1
        const filtered = employeesArr
          .filter((e: any) => !e.attrition)
          .map((e: any) => ({
            ...e,
            id: e.employee_id,
            name: e.full_name || '',
            position: e.job_role || '',
            department: e.department || '',
            risk: e.risk,
            reason: e.reason || '',
            avatar_url: e.avatar_url || '',
            years_at_company: e.years_at_company,
            gender: e.gender,
            age: e.age,
            attrition: e.attrition,
          }));
        setEmployees(filtered);
      } catch (e) {
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    }
    fetchRiskyEmployees();
  }, []);

  // Убираем дубликаты по id
  const uniqueEmployees = Array.from(new Map(employees.map(e => [e.id, e])).values());

  // Группировка по категориям риска (чтобы сумма всегда совпадала)
  const highRisk = uniqueEmployees.filter(e => e.risk >= 0.7);
  const mediumRisk = uniqueEmployees.filter(e => e.risk >= 0.4 && e.risk < 0.7);
  const lowRisk = uniqueEmployees.filter(e => e.risk < 0.4);

  // Аналитика по всем сотрудникам
  const total = uniqueEmployees.length;
  const femaleCount = uniqueEmployees.filter((e) => e.gender && (e.gender.toLowerCase().includes('female') || e.gender.toLowerCase().includes('жен'))).length;
  const maleCount = total - femaleCount;
  // Для диагностики, можно временно посмотреть значения gender:
  // console.log([...new Set(uniqueEmployees.map(e => e.gender))]);
  const avgRisk = total ? (uniqueEmployees.reduce((sum, e) => sum + e.risk, 0) / total) : 0;
  const avgYears = total && uniqueEmployees[0].hasOwnProperty('years_at_company') ?
    (uniqueEmployees.reduce((sum, e) => sum + (e.years_at_company || 0), 0) / total) : null;

  const [selectedEmployee, setSelectedEmployee] = useState<RiskyEmployee | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenDialog = (emp: RiskyEmployee) => {
    setSelectedEmployee(emp);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedEmployee(null);
  };

  const renderList = (list: RiskyEmployee[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {list.map((emp) => (
        <Card key={emp.id} className="flex flex-col p-4 bg-white shadow rounded-lg border border-blue-100">
          <CardContent className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-3">
              {emp.avatar_url ? (
                <img src={emp.avatar_url} alt={emp.name} className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-blue-500">{emp.name[0]}</span>
              )}
            </div>
            <div className="text-lg font-semibold mb-1">{emp.name}</div>
            <div className="text-sm text-gray-500 mb-2">{emp.position}, {emp.department}</div>
            <div className="flex items-center mb-2">
              <span className={`font-bold mr-2 ${emp.risk >= 0.7 ? 'text-red-600' : emp.risk >= 0.4 ? 'text-yellow-500' : 'text-green-600'}`}>Риск: {(emp.risk * 100).toFixed(0)}%</span>
              {emp.risk >= 0.7 && <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">Высокий</span>}
              {emp.risk >= 0.4 && emp.risk < 0.7 && <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">Средний</span>}
              {emp.risk < 0.4 && <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Низкий</span>}
            </div>
            <div className="text-xs text-gray-400 mb-2">{emp.reason}</div>
            <button className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition" onClick={() => handleOpenDialog(emp)}>
              Подробнее
            </button>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Категории риска
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const filterByRisk = (list: RiskyEmployee[]) => {
    if (riskFilter === 'high') return list.filter(e => e.risk >= 0.7);
    if (riskFilter === 'medium') return list.filter(e => e.risk >= 0.4 && e.risk < 0.7);
    if (riskFilter === 'low') return list.filter(e => e.risk < 0.4);
    return list;
  };

  // Готовим данные для pie chart по департаментам с учетом фильтра
  const filteredEmployees = filterByRisk(uniqueEmployees);
  const departmentStats = Object.entries(
    filteredEmployees.reduce((acc, emp) => {
      if (!acc[emp.department]) acc[emp.department] = 0;
      acc[emp.department]++;
      return acc;
    }, {} as Record<string, number>)
  );

  const departmentPieData = {
    labels: departmentStats.map(([dep]) => dep),
    datasets: [
      {
        data: departmentStats.map(([, count]) => count),
        backgroundColor: [
          '#60a5fa', '#fbbf24', '#34d399', '#f87171', '#a78bfa', '#f472b6', '#fdba74', '#4ade80', '#38bdf8', '#facc15'
        ],
      },
    ],
  };

  const departmentPieOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: false },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.raw}`;
          }
        }
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F8F8] p-8">
      <div className="flex items-center mb-8">
        <NotificationIcon className="w-8 h-8 text-blue-500 mr-3" />
        <h1 className="text-2xl font-bold">Уведомления о риске увольнения</h1>
      </div>
      {loading ? (
        <div>Загрузка...</div>
      ) : (
        <>
        {/* Аналитика по всем сотрудникам */}
        <div className="mb-6 bg-white rounded shadow p-4 flex flex-col md:flex-row gap-4">
          <div>Всего сотрудников: <b>{total}</b></div>
          <div>Средний риск: <b>{(avgRisk * 100).toFixed(1)}%</b></div>
          {avgYears !== null && <div>Средний стаж: <b>{avgYears.toFixed(1)} лет</b></div>}
          <div>Мужчин: <b>{maleCount}</b></div>
          <div>Женщин: <b>{femaleCount}</b></div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded shadow p-4 flex items-center justify-between">
            <div>
              <span className="font-bold">Сотрудники с высоким риском ухода</span>
              <span className="ml-3 text-gray-500">({highRisk.length})</span>
            </div>
            <button
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-900 font-semibold shadow transition-all text-base focus:outline-none focus:ring-2 focus:ring-blue-200"
              onClick={() => navigate('/notifications/high')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
              Подробно
            </button>
          </div>

          <div className="bg-white rounded shadow p-4 flex items-center justify-between">
            <div>
              <span className="font-bold">Сотрудники со средним риском ухода</span>
              <span className="ml-3 text-gray-500">({mediumRisk.length})</span>
            </div>
            <button
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-900 font-semibold shadow transition-all text-base focus:outline-none focus:ring-2 focus:ring-blue-200"
              onClick={() => navigate('/notifications/medium')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
              Подробно
            </button>
          </div>

          <div className="bg-white rounded shadow p-4 flex items-center justify-between">
            <div>
              <span className="font-bold">Сотрудники с низким риском ухода</span>
              <span className="ml-3 text-gray-500">({lowRisk.length})</span>
            </div>
            <button
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-900 font-semibold shadow transition-all text-base focus:outline-none focus:ring-2 focus:ring-blue-200"
              onClick={() => navigate('/notifications/low')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
              Подробно
            </button>
          </div>
        </div>
        {/* График по департаментам */}
        <div className="mt-10 bg-white rounded shadow p-4 flex flex-col items-center">
          <div className="text-lg font-semibold mb-4">Распределение сотрудников по департаментам</div>
          <div className="mb-4 flex gap-2 justify-center">
            <button onClick={() => setRiskFilter('all')} className={`px-4 py-1 rounded ${riskFilter==='all' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-900'}`}>Все</button>
            <button onClick={() => setRiskFilter('high')} className={`px-4 py-1 rounded ${riskFilter==='high' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-900'}`}>Высокий</button>
            <button onClick={() => setRiskFilter('medium')} className={`px-4 py-1 rounded ${riskFilter==='medium' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-900'}`}>Средний</button>
            <button onClick={() => setRiskFilter('low')} className={`px-4 py-1 rounded ${riskFilter==='low' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-900'}`}>Низкий</button>
          </div>
          <div style={{ width: 340, height: 340 }}>
            <Pie data={departmentPieData} options={departmentPieOptions} />
          </div>
        </div>
        </>
      )}
      {/* Модальное окно с подробной информацией */}
      <Modal isOpen={dialogOpen} onClose={handleCloseDialog}>
        {selectedEmployee && (
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl" onClick={handleCloseDialog}>&times;</button>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                {selectedEmployee.avatar_url ? (
                  <img src={selectedEmployee.avatar_url} alt={selectedEmployee.name} className="w-24 h-24 rounded-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-blue-500">{selectedEmployee.name[0]}</span>
                )}
              </div>
              <div className="text-2xl font-bold mb-1">{selectedEmployee.name}</div>
              <div className="text-md text-gray-500 mb-2">{selectedEmployee.position}, {selectedEmployee.department}</div>
              <div className="flex items-center mb-2">
                <span className={`font-bold mr-2 ${selectedEmployee.risk >= 0.7 ? 'text-red-600' : selectedEmployee.risk >= 0.4 ? 'text-yellow-500' : 'text-green-600'}`}>Риск: {(selectedEmployee.risk * 100).toFixed(0)}%</span>
                {selectedEmployee.risk >= 0.7 && <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">Высокий</span>}
                {selectedEmployee.risk >= 0.4 && selectedEmployee.risk < 0.7 && <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">Средний</span>}
                {selectedEmployee.risk < 0.4 && <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Низкий</span>}
              </div>
              <div className="w-full mt-4 space-y-2">
                <div className="flex justify-between text-gray-700"><span>Возраст:</span> <span>{selectedEmployee.age || '-'}</span></div>
                <div className="flex justify-between text-gray-700"><span>Стаж в компании:</span> <span>{selectedEmployee.years_at_company || '-'}</span></div>
                <div className="flex justify-between text-gray-700"><span>Пол:</span> <span>{selectedEmployee.gender || '-'}</span></div>
                <div className="flex justify-between text-gray-700"><span>Причина риска:</span> <span>{selectedEmployee.reason || '-'}</span></div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
