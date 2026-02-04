// Icons from lucide-react
import { MoveLeft, User2Icon } from "lucide-react";

// NavLink for routing with active state
import { NavLink } from "react-router-dom";

// Sidebar navigation component
const Sidebar = () => {
  // Dynamic class for active / inactive links
  const linkClass = ({ isActive }) =>
    `w-full p-2 border text-center transition
     ${
       isActive
         ? "bg-gray-800 text-white" // Active link style
         : "text-blue-400 hover:bg-gray-100" // Inactive link style
     }`;

  return (
    <div className="flex h-screen flex-1">
      {/* Sidebar container */}
      <div className="border-r flex flex-col items-center w-fit">
        {/* Header section */}
        <div className="flex justify-between w-full p-2">
          <User2Icon /> {/* User icon */}
          <MoveLeft className="cursor-pointer" />{" "}
          {/* Collapse icon (UI only) */}
        </div>

        {/* Navigation links */}
        <div className="mt-2 flex flex-col w-full">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>

          <NavLink to="/employee" className={linkClass}>
            Employee
          </NavLink>

          <NavLink to="/schedule" className={linkClass}>
            Schedule
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
