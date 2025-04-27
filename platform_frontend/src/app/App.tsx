// src/App.tsx
import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../layout/Sidebar.tsx";
import Header from "../layout/Header.tsx";
import Dashboard from "../pages/Dashboard.tsx";
import ReportSelector from "../pages/reports/ReportSelector.tsx"; // правильный импорт
import DashboardPage from "../pages/reports/DashboardPage.tsx";    // добавить
// … другие импорты

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
              <Route path="/reports/:type" element={<ReportSelector />} /> {/* Страница выбора отчетов по типу */}
              <Route path="/reports/:type/:id" element={<DashboardPage />} /> {/* Страница отдельного отчета */}
              {/* другие маршруты */}
            </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}