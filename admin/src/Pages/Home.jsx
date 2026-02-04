import { useEffect, useState } from "react";
import Header from "../components/Header";
import { UseEmployeeStore } from "../store/StateManager";

const Home = () => {
  // Global store data & actions
  const { employee, shifts, getEmployee, getShifts } = UseEmployeeStore();

  // Dashboard states
  const [shiftsToday, setShiftsToday] = useState(0);
  const [todaysSchedule, setTodaysSchedule] = useState([]);
  const [upcomingShifts, setUpcomingShifts] = useState([]);
  const [nextShift, setNextShift] = useState({ time: "--:--", name: "" });

  // Initial data fetch (employees + shifts)
  useEffect(() => {
    getEmployee();
    getShifts();
  }, [getEmployee, getShifts]);

  // Process shift data whenever shifts change
  useEffect(() => {
    if (!shifts || shifts.length === 0) return;

    const today = new Date().toDateString();
    const now = new Date();

    // Sort shifts by date
    const sortedShifts = shifts
      .slice()
      .sort((a, b) => new Date(a.shift_date) - new Date(b.shift_date));

    // Today's shifts
    const todayShifts = sortedShifts.filter(
      (s) => new Date(s.shift_date).toDateString() === today,
    );

    setShiftsToday(todayShifts.length);
    setTodaysSchedule(todayShifts);

    // Next shift today (if exists)
    if (todayShifts.length >= 2) {
      const next = todayShifts[1];
      setNextShift({
        time: formatTime(next.start_time),
        name: next.employee_name,
      });
    } else {
      setNextShift({ time: "--:--", name: "" });
    }

    // Future shifts (after current time)
    const futureShifts = sortedShifts.filter(
      (s) => new Date(s.shift_date) > now,
    );

    setUpcomingShifts(futureShifts);
  }, [shifts]);

  // Convert time to AM/PM format
  const formatTime = (time) => {
    let hour = Number(time.split(":")[0]);

    if (hour > 12) {
      return `0${hour - 12}:${time.split(":")[1]} PM`;
    }
    return `${time} AM`;
  };

  // Format date nicely
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

  // Get initials for avatar
  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <div className="p-6 border mt-2 min-h-screen">
      <Header />

      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <div className="text-right">
          <p className="font-semibold">System Admin</p>
          <p className="text-gray-500 text-sm">Admin</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Employees */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <span className="text-gray-500 text-sm">Total Employees</span>
          <div className="text-2xl font-bold mt-2">{employee?.length || 0}</div>
          <p className="text-gray-400 text-sm">Active staff members</p>
        </div>

        {/* Shifts Today */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <span className="text-gray-500 text-sm">Shifts Today</span>
          <div className="text-2xl font-bold mt-2">{shiftsToday}</div>
          <p className="text-gray-400 text-sm">Scheduled for today</p>
        </div>

        {/* Next Shift */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <span className="text-gray-500 text-sm">Next Shift Starts</span>
          <div className="text-2xl font-bold mt-2">{nextShift.time}</div>
          <p className="text-gray-400 text-sm">
            {nextShift.name ? `Next: ${nextShift.name}` : "No upcoming shifts"}
          </p>
        </div>
      </div>

      {/* Schedule Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="font-semibold mb-4 text-lg">Today's Schedule</h2>

          {todaysSchedule.length === 0 ? (
            <p className="text-gray-400">No shifts scheduled for today</p>
          ) : (
            todaysSchedule.map((shift, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center mb-3 p-2 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                    {getInitials(shift.employee_name)}
                  </div>
                  <div>
                    <p className="font-semibold">{shift.employee_name}</p>
                    <p className="text-gray-400 text-sm">employee</p>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-500">
                  {formatTime(shift.start_time)}
                  <div className="text-xs">{formatDate(shift.shift_date)}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Upcoming Shifts */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="font-semibold mb-4 text-lg">Upcoming Shifts</h2>

          {upcomingShifts.length === 0 ? (
            <p className="text-gray-400">No upcoming shifts found</p>
          ) : (
            upcomingShifts.map((shift, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center mb-3 p-2 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                    {getInitials(shift.employee_name)}
                  </div>
                  <div>
                    <p className="font-semibold">{shift.employee_name}</p>
                    <p className="text-gray-400 text-sm">employee</p>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-500">
                  {formatTime(shift.start_time)}
                  <div className="text-xs">{formatDate(shift.shift_date)}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
