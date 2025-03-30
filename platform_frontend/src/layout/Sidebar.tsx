import { useState } from "react";
import DashboardIcon from "../icons/dashboard.svg?react";
import ReportsIcon from "../icons/reports.svg?react";
import UsersIcon from "../icons/users.svg?react";
import OrdersIcon from "../icons/orders.svg?react";
import DepartmentsIcon from "../icons/departments.svg?react";
import HelpIcon from "../icons/help.svg?react";
import SettingsIcon from "../icons/settings.svg?react";
import ArrowDownIcon from "../icons/arrow-down.svg?react";

const Sidebar = () => {
  const [active, setActive] = useState("dashboard");

  const menuItems = [
    { id: "dashboard", label: "Дэшборд", icon: <DashboardIcon /> },
    { id: "reports", label: "Отчеты", icon: <ReportsIcon /> },
    { id: "employees", label: "Сотрудники", icon: <UsersIcon /> },
    { id: "orders", label: "Приказы", icon: <OrdersIcon /> },
    { id: "departments", label: "Подразделения", icon: <DepartmentsIcon /> },
  ];

  const bottomItems = [
    { id: "help", label: "Помощь", icon: <HelpIcon /> },
    { id: "settings", label: "Настройки", icon: <SettingsIcon /> },
  ];

  return (
    <aside className="w-[259px] h-screen bg-white flex flex-col justify-between px-6 py-9 fixed top-0 left-0 z-50">
      <div className="flex flex-col gap-10">
        <h1 className="text-2xl font-bold font-montserrat text-black">HRDashboard</h1>

        <nav className="flex flex-col gap-3">
          {menuItems.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`flex items-center justify-between rounded-lg px-4 py-4 text-sm font-semibold transition ${
                active === id ? "bg-[#5FB3F6] text-white" : "text-black hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-5 h-5">{icon}</div>
                {label}
              </div>
              <ArrowDownIcon className={`w-3 h-3 ${active === id ? "text-white" : "text-[#A3AED0]"}`} />
            </button>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-5">
        {bottomItems.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className="flex items-center gap-3 px-2 py-2 text-sm font-semibold text-black hover:bg-gray-100 rounded-lg"
          >
            <div className="w-5 h-5">{icon}</div>
            {label}
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;