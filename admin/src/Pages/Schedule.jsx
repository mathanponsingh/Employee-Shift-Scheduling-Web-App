import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { UseEmployeeStore } from "../store/StateManager";
import ShiftEdit from "../components/ShiftEdit";
import { format, isToday, isTomorrow, startOfMonth, endOfMonth } from "date-fns";
import { Delete, Pencil, Calendar, List, FileDown, Search } from "lucide-react";
import UpdateShift from "../components/UpdateShift";
import CalendarView from "../components/CalendarView";
import { axiosInstance } from "../utils/axiosInstance";
import toast from "react-hot-toast";

const Schedule = () => {
  const { getShifts, shifts, deleteSchedule } = UseEmployeeStore();
  const [show, setShow] = useState(false);
  const [tab, setTab] = useState("all"); // all | today | upcoming
  const [viewMode, setViewMode] = useState("list"); // list | calendar
  const [currentDate, setCurrentDate] = useState(new Date());
  const [search, setSearch] = useState("");
  const [showUpdate,setShowUpdate] = useState(false)
  
  const [selectedUser, setSelectedUser] = useState({
    id:"",
    name:""
  });

  useEffect(() => {
    // Fetch shifts based on view mode
    if (viewMode === "calendar") {
      const start = startOfMonth(currentDate).toISOString().split('T')[0];
      const end = endOfMonth(currentDate).toISOString().split('T')[0];
      getShifts({ startDate: start, endDate: end });
    } else {
      getShifts(); // Fetch all for list view (or default)
    }
  }, [viewMode, currentDate]); // Removed shifts dependency to avoid loop

  const handleExport = async () => {
    try {
      const response = await axiosInstance.get("/auth/export-shifts", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "shifts_export.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Schedule exported successfully");
    } catch (error) {
      console.error("Export failed", error);
      toast.error("Failed to export schedule");
    }
  };

  const filterShifts = () => {
    let shift = shifts || [];
    
    // Search filter
    if (search) {
      shift = shift.filter(s => 
        s.employee_name?.toLowerCase().includes(search.toLowerCase()) ||
        s.role?.toLowerCase().includes(search.toLowerCase())
      );
    }

    shift = shift.sort(
      (a, b) => new Date(a.shift_date) - new Date(b.shift_date),
    );

    const now = new Date();
    if (tab === "today") {
      return shift.filter((s) => isToday(new Date(s.shift_date)));
    } else if (tab === "upcoming") {
      return shift.filter((s) => new Date(s.shift_date) > now);
    }
    return shift;
  };

  const filteredShifts = filterShifts();

  const getDuration = (start, end) => {
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);

    let startMinutes = sh * 60 + sm;
    let endMinutes = eh * 60 + em;

    if (endMinutes < startMinutes) {
      endMinutes += 24 * 60;
    }

    return ((endMinutes - startMinutes) / 60).toFixed(0);
  };


  const getAvatar = (name) => {
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("");
    return initials.toUpperCase();
  };

  const formatDateLabel = (dateStr) => {
    const date = new Date(dateStr);
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "MMM d, yyyy");
  };

  useEffect(()=>{getShifts()},[])

  return (
    <div className="min-h-screen border p-6 ">
      <Header />

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Schedule</h1>
        <button
          onClick={() => setShow(true)}
          className="bg-blue-600 cursor-pointer px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Add Shift
        </button>
      </div>

      <p className="text-gray-500 mb-4">Manage employee shifts and coverage.</p>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        {/* Tabs / View Toggle */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
              viewMode === "list" ? "bg-white shadow text-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <List size={18} /> List
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
              viewMode === "calendar" ? "bg-white shadow text-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Calendar size={18} /> Calendar
          </button>
        </div>

        {/* Search & Export */}
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search employee..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition"
          >
            <FileDown size={18} /> Export
          </button>
        </div>
      </div>

      {viewMode === "list" && (
        <div className="flex gap-2 mb-4">
          {["all", "today", "upcoming"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                tab === t
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {t === "all" ? "All Shifts" : t === "today" ? "Today" : "Upcoming"}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {viewMode === "calendar" ? (
        <CalendarView 
          shifts={filteredShifts} 
          currentDate={currentDate} 
          setCurrentDate={setCurrentDate} 
        />
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                Employee
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                Date
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                Time
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                Duration
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y ">
            {filteredShifts.map((shift) => (
              <tr
                key={shift.id}
                className="hover:bg-gray-50 transition cursor-pointer text-center"
              >
                {/* Employee */}
                <td className="py-3 px-4 flex items-center gap-3">
                  <div className="bg-gray-200 text-gray-700 font-semibold rounded-full w-10 h-10 flex items-center justify-center">
                    {getAvatar(shift.employee_name)}
                  </div>
                  <div>
                    <div className="font-medium">{shift.employee_name}</div>
                    <div className="text-sm text-gray-400">{shift.role}</div>
                  </div>
                </td>

                {/* Date */}
                <td className="py-3 px-4 text-gray-700 font-medium">
                  {format(new Date(shift.shift_date), "MMM d, yyyy")}
                  <div className="text-sm text-gray-400">
                    {formatDateLabel(shift.shift_date)}
                  </div>
                </td>

                {/* Time */}
                <td className="py-3 px-4">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium text-sm">
                    {shift.start_time} - {shift.end_time}
                  </span>
                </td>

                {/* Duration */}
                <td className="py-3 px-4 font-medium">
                  {getDuration(shift.start_time, shift.end_time)} hrs
                </td>

                {/* Action */}
                <td className="py-3 px-4 font-medium flex gap-2 items-center">
                  <Pencil
                    className=" hover:text-green-600 "
                    onClick={() => {setSelectedUser({id:shift.id,name:shift.name});setShowUpdate(true);}}
                    size={18}
                  />
                  <Delete
                    className="hover:text-red-600"
                    size={18}
                    onClick={() => deleteSchedule(shift.id)}
                  />
                </td>
                {showUpdate && (
                  <UpdateShift
                    id={selectedUser.id}
                    name={selectedUser.employee_name}
                    setShowUpdate={setShowUpdate}
                  />
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {filteredShifts.length === 0 && (
          <div className="text-center py-6 text-gray-400">No shifts found.</div>
        )}
      </div>
      )}

      {show && <ShiftEdit setShow={setShow} />}
    </div>
  );
};

export default Schedule;
