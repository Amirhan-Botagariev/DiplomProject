import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import SearchHeader from "./Header";

const AppLayout = () => {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 ml-[259px]">
        {/* ⬅️ отступ слева для основного контента */}
        <SearchHeader />
        <main className="p-8 bg-[#FAFAFA] min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;