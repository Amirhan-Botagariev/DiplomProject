import { useEffect, useRef, useState } from "react";
import SearchIcon from "../icons/search.svg?react";
import MailIcon from "../icons/mail.svg?react";
import ProfileIcon from "../icons/profile.svg?react";
import ArrowDownIcon from "../icons/arrow-down.svg?react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Закрытие меню при клике вне dropdown-а
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
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
        <MailIcon className="w-[21px] h-[21px] text-black" />
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