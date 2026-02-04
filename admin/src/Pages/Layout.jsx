import { Outlet, NavLink } from "react-router-dom";
import { useState } from "react";
import { Settings, Settings2 } from "lucide-react";

const Layout = () => {

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Employee", path: "/employee" },
    { name: "Schedule", path: "/schedule" },
  ];

  return (
    <div className="flex h-screen ">

      {/* Main content */}
      <div className="flex-1 p-6 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
