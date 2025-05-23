// src/App.tsx
import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../layout/Sidebar.tsx";
import Header from "../layout/Header.tsx";
import Dashboard from "../pages/Dashboard.tsx";
import ReportSelector from "../pages/reports/ReportSelector.tsx"; // правильный импорт
import DashboardPage from "../pages/reports/DashboardPage.tsx";    // добавить
import DemoAgeReportPage from "../pages/DemoAgeReportPage"; // добавить
import DemoGenderReportPage from "../pages/DemoGenderReportPage"; // добавить
import DemoEducationReportPage from "../pages/DemoEducationReportPage"; // добавить
import NotificationsPage from "../pages/NotificationsPage.tsx";
import RiskCategoryPage from "../pages/RiskCategoryPage.tsx";
import EmployeesListPage from "../pages/EmployeesListPage";
import JobRolesPage from "../pages/JobRolesPage";
import NewsPage from "../pages/NewsPage.tsx"; // убедись в правильном пути

export default function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <BrowserRouter>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className={`transition-all ${collapsed ? "ml-[80px]" : "ml-[260px]"} flex flex-col`}>
        <Header />
        <div className="p-6">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/reports/:type" element={<ReportSelector />} /> {/* Страница выбора отчетов по типу */}
              <Route path="/reports/:type/:id" element={<DashboardPage />} /> {/* Страница отдельного отчета */}
              <Route path="/reports/demo-age" element={<DemoAgeReportPage />} />
              <Route path="/reports/demo-gender" element={<DemoGenderReportPage />} />
              <Route path="/reports/demo-education" element={<DemoEducationReportPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/notifications/:category" element={<RiskCategoryPage />} />
              <Route path="/employees/list" element={<EmployeesListPage />} />
              <Route path="/employees/positions" element={<JobRolesPage />} />
            </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}