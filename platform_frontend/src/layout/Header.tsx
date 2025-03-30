import SearchIcon from "../icons/search.svg?react";
import MailIcon from "../icons/mail.svg?react";
import ProfileIcon from "../icons/profile.svg?react";
import ArrowDownIcon from "../icons/arrow-down.svg?react";

const Header = () => {
  return (
    <header className="w-full h-[86px] bg-white flex items-center justify-between px-8 border-b border-[#EDEDED] font-montserrat">
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
      <div className="flex items-center gap-6">
        <MailIcon className="w-[21px] h-[21px] text-black" />
        <div className="flex items-center gap-2 cursor-pointer">
          <ProfileIcon className="w-[21px] h-[21px] text-black" />
          <ArrowDownIcon className="w-[10px] h-[10px] text-black" />
        </div>
      </div>
    </header>
  );
};

export default Header;