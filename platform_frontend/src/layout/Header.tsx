import { useEffect, useRef, useState } from "react";
import SearchIcon from "../icons/search.svg?react";
import MailIcon from "../icons/mail.svg?react";
import ProfileIcon from "../icons/profile.svg?react";
import ArrowDownIcon from "../icons/arrow-down.svg?react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const navigate = useNavigate();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("access_token");

      await fetch("/api/v1/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.removeItem("access_token");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="w-full h-[86px] bg-white flex items-center justify-between px-8 border-b border-[#EDEDED] font-montserrat relative">
      {/* Поиск */}
      <div className="flex items-center bg-[#F8F8F8] rounded-lg px-4 py-2 w-[369px]">
        <SearchIcon className="w-4 h-4 text-black" />
        <input
          type="text"
          placeholder="Поиск"
          className="ml-3 bg-transparent outline-none text-sm font-medium text-[#ACACAC] w-full"
        />
      </div>

      {/* Навигация */}
      <div className="flex items-center gap-6">
        <span className="text-sm font-medium text-black cursor-pointer">Документы</span>
        <span className="text-sm font-medium text-black cursor-pointer">Новости</span>
        <span className="text-sm font-medium text-black cursor-pointer">Отчет</span>
      </div>

      {/* Иконки справа */}
      <div className="flex items-center gap-6 relative">
        {/* Уведомления */}
        <div ref={notificationsRef} className="relative">
          <MailIcon
            className="w-[21px] h-[21px] text-black cursor-pointer"
            onClick={() => setNotificationsOpen((prev) => !prev)}
          />
          {notificationsOpen && (
            <div className="absolute top-[calc(100%+10px)] right-0 w-96 max-h-[400px] bg-white border shadow-2xl rounded-xl z-50 overflow-hidden flex flex-col">
              <div className="px-5 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-black">Уведомления</h2>
              </div>
              <div className="overflow-y-auto flex-1">
                <ul className="divide-y divide-gray-100">
                  {[
                    {
                      title: "Новое сообщение от администратора",
                      date: "23 мая 2025",
                      description: "Пожалуйста, проверьте почту.",
                    },
                    {
                      title: "Срок сдачи отчета",
                      date: "22 мая 2025",
                      description: "Не забудьте сдать отчет до конца дня.",
                    },
                    {
                      title: "Обновление системы",
                      date: "20 мая 2025",
                      description: "Система была успешно обновлена.",
                    },
                  ].map((notif, i) => (
                    <li key={i} className="px-5 py-4 hover:bg-gray-50 cursor-pointer">
                      <p className="text-sm text-gray-400">{notif.date}</p>
                      <p className="text-base font-medium text-black">{notif.title}</p>
                      <p className="text-sm text-gray-600">{notif.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Профиль */}
        <div ref={dropdownRef} className="relative">
          <div
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <ProfileIcon className="w-[21px] h-[21px] text-black" />
            <ArrowDownIcon
              className={`w-[10px] h-[10px] text-black transition ${
                menuOpen ? "rotate-180" : ""
              }`}
            />
          </div>

          {menuOpen && (
            <div className="absolute top-[calc(100%+10px)] right-0 w-48 bg-white border shadow-lg rounded-lg z-50">
              <div className="flex flex-col">
                <button
                  className="text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => console.log("Профиль")}
                >
                  Профиль
                </button>
                <button
                  className="text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Выйти
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
