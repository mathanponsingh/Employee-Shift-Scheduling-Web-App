import { CalendarIcon, ClockIcon, LogOut, Settings } from "lucide-react";
import { useEmployee } from "../store/useEmlpoyee";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EmployeeDashboard = () => {
  const { getShifts, shifts, logout, employee } = useEmployee();
  const navigate = useNavigate();

  /* =======================
     DATE & TIME HELPERS
  ======================== */

  const formatTime = (time) => {
    if (!time) return "---|---";
    let [h, m, s] = time.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${String(h).padStart(2, "0")}:${m}:${s} ${period}`;
  };

  const formatTimeRange = (start, end) => {
    return `${formatTime(start)} - ${formatTime(end)}`;
  };

  /* =======================
     DATE CALCULATIONS
  ======================== */

  const today = new Date().toISOString().split("T")[0];

  // Today's shift
  const currentShift = shifts
    .filter((s) => s.shift_date.split("T")[0] === today)
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  // Upcoming shifts
  const upcomingShifts = shifts
    .filter((s) => s.shift_date.split("T")[0] > today)
    .sort((a, b) => a.shift_date.localeCompare(b.shift_date));

  /* =======================
     FETCH DATA
  ======================== */

  useEffect(() => {
    getShifts();
  }, []);

  /* =======================
     UI
  ======================== */

  return (
    <div className="min-h-screen">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-8 py-4 border-b">
        <span className="font-bold text-lg">ShiftMaster</span>

        <div className="flex items-center gap-8">
          <button className="text-blue-600 font-medium">My Shifts</button>

          <div className="flex items-center gap-3">
            <p className="text-sm font-bold">
              {employee?.name}
              <span className="block text-xs font-normal text-right">
                Employee
              </span>
            </p>

            <div className="flex gap-3">
              <Settings
                className="cursor-pointer"
                onClick={() => navigate("/settings")}
              />
              <LogOut
                className="cursor-pointer"
                onClick={logout}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <main className="max-w-4xl mx-auto p-12">
        <h1 className="text-4xl font-bold mb-2">
          Hello, {employee?.name}
        </h1>
        <p className="mb-12 text-lg">
          Here is your upcoming schedule.
        </p>

        {/* CURRENT SHIFT */}
        <div className="bg-blue-600 rounded-3xl p-10 text-white mb-10">
          <div className="flex items-center gap-2 mb-4">
            <ClockIcon />
            <span>Current Shift</span>
          </div>

          {currentShift.length > 0 ? (
            <>
              <p className="text-2xl opacity-90 mb-6">
                {formatTimeRange(
                  currentShift[0].start_time,
                  currentShift[0].end_time
                )}
              </p>
              <p className="text-blue-100 italic">Don't be late!</p>
            </>
          ) : (
            <>
              <p className="text-2xl opacity-90 mb-6">--- | ---</p>
              <p className="text-blue-100 italic">
                No shift assigned for today
              </p>
            </>
          )}
        </div>

        {/* UPCOMING SHIFTS */}
        <div className="rounded-3xl border border-slate-200 p-8">
          <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
            <CalendarIcon /> Upcoming Shifts
          </h3>
          <p className="text-slate-500 mb-8">
            Your schedule for the next few days
          </p>

          {upcomingShifts.length > 0 ? (
            upcomingShifts.map((shift) => (
              <div
                key={shift.id}
                className="border border-slate-100 rounded-2xl p-6 mb-4"
              >
                <span className="bg-slate-100 px-3 py-1 rounded-full text-xs font-bold mb-3 inline-block">
                  {shift.shift_date.split("T")[0]}
                </span>

                <h4 className="text-3xl font-bold">
                  {formatTime(shift.start_time)}
                </h4>
                <p className="text-slate-400">
                  until {formatTime(shift.end_time)}
                </p>
              </div>
            ))
          ) : (
            <div className="border border-slate-100 rounded-2xl p-6 w-1/3">
              <h4 className="text-3xl font-bold">--- | ---</h4>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
