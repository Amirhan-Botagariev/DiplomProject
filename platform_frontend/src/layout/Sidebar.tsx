import React, {useEffect, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
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

interface DashboardItem {
  id: number;
  name: string;
  route_id: string;
  description?: string;
  graphs?: any[];
}

interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  route?: string;
  children?: DashboardItem[];
}

const Sidebar = ({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [dashboardReports, setDashboardReports] = useState<DashboardItem[]>([]);

  const url = import.meta.env.VITE_BACKEND_URL;

  const toggleOpen = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

    useEffect(() => {
      const fetchDashboards = async () => {
        try {
          const res = await fetch(`${url}/api/v1/dashboards/`);
          const data = await res.json();
          setDashboardReports(data.map((item: DashboardItem) => ({
            ...item,
            route_id: `my-reports/${item.route_id}`,
          })));
        } catch (err) {
          console.error("Ошибка загрузки дэшбордов:", err);
        }
      };

      fetchDashboards();
    }, []);

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
        { id: 1, name: "Командировки", route_id: "reports/travel" },
        { id: 2, name: "Риск ухода (вероятность)", route_id: "reports/retention-risk" },
        { id: 3, name: "Пол и семейное положение", route_id: "reports/demo-gender" },
        { id: 4, name: "Возрастной профиль", route_id: "reports/demo-age" },
        { id: 5, name: "По отделам", route_id: "reports/org-department" },
        { id: 6, name: "Тренинги vs текучка", route_id: "reports/training-vs-attrition" },
        { id: 7, name: "Образование", route_id: "reports/demo-education" },
        { id: 8, name: "По ролям и уровням", route_id: "reports/org-role" },
        { id: 9, name: "Стаж в компании", route_id: "reports/tenure-company" },
        { id: 10, name: "Тренинги за год", route_id: "reports/training-year" },
        { id: 11, name: "Стаж в текущей роли / с менеджером", route_id: "reports/tenure-role" },
        { id: 12, name: "Текучка по отделам", route_id: "reports/retention-dept" },
        { id: 13, name: "Баланс работа–жизнь", route_id: "reports/work-life" },
      ],
    },
    {
      id: "my-reports",
      label: "Мои отчеты",
      icon: <ReportsIcon />,
      children: dashboardReports,
    },
    {
      id: "employees",
      label: "Сотрудники",
      icon: <UsersIcon />,
    },
    {
      id: "orders",
      label: "Приказы",
      icon: <OrdersIcon />,
      route: "/orders",
    },
    {
      id: "departments",
      label: "Подразделения",
      icon: <DepartmentsIcon />,
      route: "/departments",
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
            {!collapsed && <h1 className="text-2xl font-bold">HRDashboard</h1>}
            <button onClick={() => setCollapsed(!collapsed)} className={`${collapsed ? "" : "ml-auto"}`}>
              <ArrowRightIcon className={`w-4 h-4 ${collapsed ? "" : "rotate-180"}`} />
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            {menuItems.map(({ id, label, icon, route, children }) => {
              const isActive = route ? location.pathname.startsWith(route) : false;
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
                        <div className={`w-5 h-5`}>{icon}</div>
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
                        <div className="w-5 h-5">{icon}</div>
                        {!collapsed && label}
                      </div>
                      {!collapsed && children && (
                        <ArrowDownIcon
                          className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""} ${
                            isOpen ? "text-white" : "text-black"
                          }`}
                        />
                      )}
                    </button>
                  )}

                  {!collapsed && isOpen && children && (
                    <div className="ml-8 mt-1 flex flex-col gap-1">
                      {children.map((child) => {
                        const route = `/${child.route_id}`;
                        const childActive = location.pathname === route;

                        return (
                          <button
                            key={child.route_id}
                            onClick={() =>
                              navigate(route, {
                                state: { dashboard: child },
                              })
                            }
                            className={`flex items-center gap-3 text-sm px-2 py-1 rounded-md text-left w-full ${
                              childActive ? "bg-[#5FB3F6] text-white" : "hover:bg-gray-100 text-black"
                            }`}
                          >
                            {child.name}
                          </button>
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