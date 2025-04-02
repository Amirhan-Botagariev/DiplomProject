import { useState } from "react";
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
} from "../icons";

const Sidebar = ({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}) => {
  const [active, setActive] = useState("dashboard");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleOpen = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Дэшборд",
      icon: <DashboardIcon />,
    },
    {
      id: "reports",
      label: "Отчеты",
      icon: <ReportsIcon />,
      children: [
        { id: "monthly", label: "Месячные отчеты" },
        { id: "annual", label: "Годовые отчеты" },
      ],
    },
    {
      id: "employees",
      label: "Сотрудники",
      icon: <UsersIcon />,
      children: [
        { id: "list", label: "Список сотрудников" },
        { id: "positions", label: "Должности" },
      ],
    },
    {
      id: "orders",
      label: "Приказы",
      icon: <OrdersIcon />,
    },
    {
      id: "departments",
      label: "Подразделения",
      icon: <DepartmentsIcon />,
    },
  ];

  const bottomItems = [
    { id: "help", label: "Помощь", icon: <HelpIcon /> },
    { id: "settings", label: "Настройки", icon: <SettingsIcon /> },
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
              {collapsed ? (
                <ArrowRightIcon className="w-4 h-4" />
              ) : (
                <ArrowRightIcon className="w-4 h-4 rotate-180" />
              )}
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            {menuItems.map(({ id, label, icon, children }) => {
              const isActive = active === id;
              const isOpen = openItems[id];

              return (
                <div key={id}>
                  <button
                    onClick={() => setActive(id)}
                    className={`flex items-center justify-between px-3 py-3 rounded-lg text-sm font-semibold transition w-full ${
                      isActive ? "bg-[#5FB3F6] text-white" : "hover:bg-gray-100 text-black"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 ${isActive ? "text-white" : "text-black"}`}>{icon}</div>
                      {!collapsed && label}
                    </div>
                    {!collapsed && children && (
                      <button onClick={() => toggleOpen(id)} type="button">
                        <ArrowDownIcon
                          className={`w-3 h-3 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          } ${isActive ? "text-white" : "text-black"}`}
                        />
                      </button>
                    )}
                  </button>

                  {!collapsed && isOpen && children && (
                    <div className="ml-10 mt-1 flex flex-col gap-1">
                      {children.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => setActive(child.id)}
                          className={`text-left text-sm px-2 py-1 rounded-md ${
                            active === child.id
                              ? "bg-[#5FB3F6] text-white"
                              : "hover:bg-gray-100 text-black"
                          }`}
                        >
                          {child.label}
                        </button>
                      ))}
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
              {bottomItems.map(({ id, label, icon }) => (
                <button
                  key={id}
                  onClick={() => setActive(id)}
                  className={`flex items-center gap-3 text-black hover:bg-gray-100 rounded-lg px-3 py-2 text-sm ${
                    active === id ? "bg-[#5FB3F6] text-white" : ""
                  }`}
                >
                  <div className="w-5 h-5">{icon}</div>
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;