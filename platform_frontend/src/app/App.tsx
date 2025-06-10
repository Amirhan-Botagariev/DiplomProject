// src/App.tsx
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Sidebar from "../layout/Sidebar.tsx";
import Header from "../layout/Header.tsx";
import Dashboard from "../pages/Dashboard.tsx";
import ReportSelector from "../pages/reports/ReportSelector.tsx"; // правильный импорт
import DashboardPage from "../pages/reports/DashboardPage.tsx";
import DemoAgeReportPage from "../pages/static_reports/DemoAgeReportPage";
import DemoGenderReportPage from "../pages/static_reports/DemoGenderReportPage.tsx";
import DemoEducationReportPage from "../pages/static_reports/DemoEducationReportPage";
import NotificationsPage from "../pages/NotificationsPage.tsx";
import RiskCategoryPage from "../pages/RiskCategoryPage.tsx";
import EmployeesListPage from "../pages/EmployeesListPage";
import JobRolesPage from "../pages/JobRolesPage";
import NewsPage from "../pages/NewsPage.tsx"; // убедись в правильном пути
import DocumentsPage from "../pages/DocumentsPage.tsx";
import LoginPage from "../pages/LoginPage.tsx";

export default function App() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isLoginPage = location.pathname === "/";

  return (
    <>
      {!isLoginPage && <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />}
      <div className={`transition-all ${!isLoginPage && (collapsed ? "ml-[80px]" : "ml-[260px]")} flex flex-col`}>
        {!isLoginPage && <Header />}
        <div className="p-6">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/documents" element={<DocumentsPage  />} />
            <Route path="/reports/:type" element={<ReportSelector />} /> {/* Страница выбора отчетов по типу */}
            <Route path="/reports/:type/:id" element={<DashboardPage />} /> {/* Страница отдельного отчета */}
            <Route path="/reports/demo-age" element={<DemoAgeReportPage />} />
            <Route path="/reports/demo-gender" element={<DemoGenderReportPage />} />
            <Route path="/reports/demo-education" element={<DemoEducationReportPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/notifications/:category" element={<RiskCategoryPage />} />
            <Route path="/employees/list" element={<EmployeesListPage />} />
            <Route path="/employees/positions" element={<JobRolesPage />} />
            <Route path="/my-reports/:id" element={<ReportSelector />} />
          </Routes>
        </div>
      </div>
    </>
  );
}