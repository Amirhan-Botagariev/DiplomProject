import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  DashboardIcon,
  ReportsIcon,
  UsersIcon,
  OrdersIcon,
  DepartmentsIcon,
  HelpIcon,
  SettingsIcon,
  ArrowRightIcon,
  ArrowDownIcon,
  NotificationIcon
} from "../icons";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  route?: string;
  children?: MenuItem[];
}

const Sidebar = ({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}) => {
  const location = useLocation();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleOpen = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Дэшборд",
      icon: <DashboardIcon />,
      route: "/dashboard",
    },
    {
      id: "reports",
      label: "Отчёты",
      icon: <ReportsIcon />,
      children: [
        { id: "demo-age", label: "Возрастной профиль", icon: <></>, route: "/reports/demo-age" },
        { id: "demo-gender", label: "Пол и семейное положение", icon: <></>, route: "/reports/demo-gender" },
        { id: "demo-education", label: "Образование", icon: <></>, route: "/reports/demo-education" },
        { id: "org-department", label: "По отделам", icon: <></>, route: "/reports/org-department" },
        { id: "org-role", label: "По ролям и уровням", icon: <></>, route: "/reports/org-role" },
        { id: "tenure-company", label: "Стаж в компании", icon: <></>, route: "/reports/tenure-company" },
        { id: "tenure-role", label: "Стаж в текущей роли / с менеджером", icon: <></>, route: "/reports/tenure-role" },
        { id: "retention-dept", label: "Текучка по отделам", icon: <></>, route: "/reports/retention-dept" },
        { id: "retention-risk", label: "Риск ухода (вероятность)", icon: <></>, route: "/reports/retention-risk" },
        { id: "travel", label: "Командировки", icon: <></>, route: "/reports/travel" },
        { id: "work-life", label: "Баланс работа‑жизнь", icon: <></>, route: "/reports/work-life" },
        { id: "training-year", label: "Тренинги за год", icon: <></>, route: "/reports/training-year" },
        { id: "training-vs-attrition", label: "Тренинги vs текучка", icon: <></>, route: "/reports/training-vs-attrition" },
      ],
    },
    {
      id: "employees",
      label: "Сотрудники",
      icon: <UsersIcon />,
      children: [
        { id: "list", label: "Список сотрудников", icon: <></>, route: "/employees/list" },
        { id: "positions", label: "Должности", icon: <></>, route: "/employees/positions" },
      ],
    },
    {
      id: "orders",
      label: "Приказы",
      icon: <OrdersIcon />,
      route: "/orders"
    },
    {
      id: "departments",
      label: "Подразделения",
      icon: <DepartmentsIcon />,
      route: "/departments"
    },
    {
      id: "notifications",
      label: "Уведомления",
      icon: <NotificationIcon />,
      route: "/notifications"
    },
  ];

  const bottomItems = [
    { id: "help", label: "Помощь", icon: <HelpIcon />, route: "/help" },
    { id: "settings", label: "Настройки", icon: <SettingsIcon />, route: "/settings" },
  ];

  return (
    <aside
      className={`h-screen bg-white fixed top-0 left-0 z-50 transition-all duration-300 ${
        collapsed ? "w-[80px]" : "w-[260px]"
      }`}
    >
      <div className="flex flex-col justify-between h-full px-4 py-6">
        <div className="flex flex-col gap-10">
          <div className={`flex items-center justify-${collapsed ? "center" : "between"} h-10`}>
            {!collapsed && <h1 className="text-2xl font-bold font-montserrat text-black">HRDashboard</h1>}
            <button onClick={() => setCollapsed(!collapsed)} className={`${collapsed ? "" : "ml-auto"}`}>
              <ArrowRightIcon className={`w-4 h-4 ${collapsed ? "" : "rotate-180"}`} />
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            {menuItems.map(({ id, label, icon, route, children }) => {
              const isActive = location.pathname.startsWith(route || `/${id}`);
              const isOpen = openItems[id];

              return (
                <div key={id}>
                  {route ? (
                    <Link
                      to={route}
                      className={`flex items-center justify-${collapsed ? "center" : "between"} px-3 py-3 rounded-lg text-sm font-semibold transition w-full ${
                        isActive ? "bg-[#5FB3F6] text-white" : "hover:bg-gray-100 text-black"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 ${isActive ? "text-white" : "text-black"}`}>{icon}</div>
                        {!collapsed && label}
                      </div>
                    </Link>
                  ) : (
                    <button
                      onClick={() => toggleOpen(id)}
                      className={`flex items-center justify-between px-3 py-3 rounded-lg text-sm font-semibold transition w-full ${
                        isOpen ? "bg-[#5FB3F6] text-white" : "hover:bg-gray-100 text-black"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 ${isOpen ? "text-white" : "text-black"}`}>{icon}</div>
                        {!collapsed && label}
                      </div>
                      {!collapsed && children && (
                        <ArrowDownIcon
                          className={`w-3 h-3 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          } ${isOpen ? "text-white" : "text-black"}`}
                        />
                      )}
                    </button>
                  )}

                  {!collapsed && isOpen && children && (
                    <div className="ml-8 mt-1 flex flex-col gap-1">
                      {children.map((child) => {
                        const childActive = location.pathname === child.route;
                        return (
                          <Link
                            key={child.id}
                            to={child.route!}
                            className={`flex items-center gap-3 text-sm px-2 py-1 rounded-md ${
                              childActive ? "bg-[#5FB3F6] text-white" : "hover:bg-gray-100 text-black"
                            }`}
                          >
                            {child.icon}
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => toggleOpen("extra")}
            className="flex items-center justify-between text-black hover:bg-gray-100 rounded-lg px-3 py-3 text-sm font-semibold w-full"
          >
            <div className="flex items-center gap-3">
              <SettingsIcon className="w-5 h-5" />
              {!collapsed && "Дополнительно"}
            </div>
            {!collapsed && (
              <ArrowDownIcon
                className={`w-3 h-3 transition-transform duration-300 ${
                  openItems["extra"] ? "rotate-180" : ""
                }`}
              />
            )}
          </button>


          {!collapsed && openItems["extra"] && (
            <div className="ml-8 flex flex-col gap-2">
              {bottomItems.map(({ id, label, icon, route }) => {
                const bottomActive = location.pathname === route;
                return (
                  <Link
                    key={id}
                    to={route!}
                    className={`flex items-center gap-3 text-sm px-3 py-2 rounded-lg transition w-full ${
                      bottomActive ? "bg-[#5FB3F6] text-white" : "hover:bg-gray-100 text-black"
                    }`}
                  >
                    <div className="w-5 h-5">{icon}</div>
                    {!collapsed && label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;