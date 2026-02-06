import { LogOut, Settings, MenuSquareIcon, MoveLeft } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { UseEmployeeStore } from "../store/StateManager";
import { useState } from "react";

const Header = () => {
  const { logout } = UseEmployeeStore();
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <header className="flex justify-between items-center mb-6 p-4 bg-white shadow">
        <div className="flex items-center justify-between w-full">
          
          {/* Logo */}
          <h1 className="text-2xl font-bold">ShiftMaster</h1>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex gap-4 text-gray-600">
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

          {/* Mobile Menu */}
          <div className="sm:hidden relative">
            {/* Hamburger */}
            <MenuSquareIcon
              className="cursor-pointer"
              onClick={() => setShow(!show)}
            />

            {/* Dropdown */}
            <div
              className={`absolute right-0 bg-white p-3 rounded flex-col shadow ${
                show ? "flex" : "hidden"
              } z-50`}
            >
              <MoveLeft
                className="cursor-pointer mb-2"
                size={20}
                onClick={() => setShow(false)}
              />

              <NavLink
                to="/home"
                onClick={() => setShow(false)}
                className={({ isActive }) =>
                  `cursor-pointer hover:text-blue-600 ${
                    isActive ? "text-blue-600 font-semibold" : ""
                  }`
                }
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/employee"
                onClick={() => setShow(false)}
                className={({ isActive }) =>
                  `cursor-pointer hover:text-blue-600 ${
                    isActive ? "text-blue-600 font-semibold" : ""
                  }`
                }
              >
                Employees
              </NavLink>

              <NavLink
                to="/schedule"
                onClick={() => setShow(false)}
                className={({ isActive }) =>
                  `cursor-pointer hover:text-blue-600 ${
                    isActive ? "text-blue-600 font-semibold" : ""
                  }`
                }
              >
                Schedule
              </NavLink>

              <NavLink
                to="/settings"
                onClick={() => setShow(false)}
                className={({ isActive }) =>
                  `cursor-pointer hover:text-blue-600 ${
                    isActive ? "text-blue-600 font-semibold" : ""
                  }`
                }
              >
                Settings
              </NavLink>

              <button
                onClick={() => {
                  logout();
                  setShow(false);
                }}
                className="cursor-pointer hover:text-blue-600 text-left"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Desktop Icons */}
          <div className="hidden sm:flex gap-2">
            <Settings
              className="cursor-pointer"
              onClick={() => navigate("/settings")}
            />
            <LogOut className="cursor-pointer" onClick={logout} />
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
