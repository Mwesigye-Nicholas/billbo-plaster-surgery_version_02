import { Outlet } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const DashboardLayout = () => {
  const [isDrawOpen, setIsDrawOpen] = useState(false);

  const closeSidebar = () => setIsDrawOpen(false);
  return (
    <div className="min-h-screen flex flex-col">
      {/* header */}
      <Header
        isDrawOpen={isDrawOpen}
        onOpenDrawer={() => setIsDrawOpen(true)}
        onCloseDrawer={() => setIsDrawOpen(false)}
      />

      {/* Body */}
      {/* Sidebar placeholder */}
      <div className="flex flex-1">
        <div
          className={`bg-gray-800 text-white p-4  ${
            isDrawOpen ? "block" : "hidden"
          } md:block`}
        >
          <Sidebar  onNavigate={closeSidebar}/>
        </div>

        {/*MAIN CONTENT */}
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
