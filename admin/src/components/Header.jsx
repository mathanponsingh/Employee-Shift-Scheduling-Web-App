import { LogOut, Settings, MenuSquareIcon } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { UseEmployeeStore } from "../store/StateManager";

// Header / Navbar component
const Header = () => {
  // Logout function from global store
  const { logout } = UseEmployeeStore();

  // Navigation hook
  const navigate = useNavigate();

  return (
    <div className="w-full">
      {/* Header container */}
      <header className="flex justify-between items-center mb-6 p-4 bg-white shadow">
        <div className="flex items-center justify-between w-full">
          {/* App title */}
          <h1 className="text-2xl font-bold">ShiftMaster</h1>

          {/* Desktop navigation */}
          <nav className="hidden sm:flex gap-4 text-gray-600">
            {/* Dashboard link */}
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `cursor-pointer hover:text-blue-600 ${
                  isActive ? "text-blue-600 font-semibold" : ""
                }`
              }
            >
              Dashboard
            </NavLink>

            {/* Employees link */}
            <NavLink
              to="/employee"
              className={({ isActive }) =>
                `cursor-pointer hover:text-blue-600 ${
                  isActive ? "text-blue-600 font-semibold" : ""
                }`
              }
            >
              Employees
            </NavLink>

            {/* Schedule link */}
            <NavLink
              to="/schedule"
              className={({ isActive }) =>
                `cursor-pointer hover:text-blue-600 ${
                  isActive ? "text-blue-600 font-semibold" : ""
                }`
              }
            >
              Schedule
            </NavLink>
          </nav>

          {/* Mobile menu */}
          <div className="sm:hidden relative group">
            {/* Hamburger icon */}
            <MenuSquareIcon className="cursor-pointer" />

            {/* Dropdown menu (shown on hover) */}
            <div className="hidden absolute right-0 bg-white p-3 rounded flex-col group-hover:flex z-100">
              <NavLink to="/home">Dashboard</NavLink>
              <NavLink to="/employee">Employees</NavLink>
              <NavLink to="/schedule">Schedule</NavLink>
              <NavLink to="/Settings">Settings</NavLink>

              {/* Logout button */}
              <button
                onClick={logout}
                className="cursor-pointer hover:text-blue-600 flex justify-start"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Desktop icons */}
          <div className="hidden sm:flex gap-2">
            {/* Settings icon */}
            <Settings onClick={() => navigate("/settings")} />

            {/* Logout icon */}
            <LogOut onClick={logout} />
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
