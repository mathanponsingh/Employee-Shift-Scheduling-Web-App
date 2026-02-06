import { CalendarIcon, ClockIcon, LogOut, Settings } from "lucide-react";
import { useEmployee } from "../store/useEmlpoyee";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EmployeeDashboard = () => {
  const { getShifts, shifts, getEmployee, user, logout, employee } = useEmployee();
  const navigate = useNavigate();
  
  const timeCalculation = (start_time, end_time) => {
    let start = Number(start_time.split(":")[0]);
    let end = Number(end_time.split(":")[0]);

    if (start > 12) {
      start =
        "0" +
        String(start - 12) +
        ":" +
        start_time.split(":")[1] +
        ":" +
        start_time.split(":")[2] +
        "PM";
    } else {
      start = start_time+"AM";
    }

    if (end > 12) {
      end =
        "0" +
        String(end - 12) +
        ":" +
        end_time.split(":")[1] +
        ":" +
        end_time.split(":")[2] +
        "PM";
    } else {
      end = end_time+"AM";
    }

    return start + "-" + end;
  };
  
  const today = new Date().toISOString().split("T")[0];

  const sortedShifts = shifts
    .slice()
    .filter((s) => s.shift_date > today)
    .sort((a, b) => a.shift_date.localeCompare(b.shift_date));

  const currentShift = shifts
    .filter((s) => s.shift_date === today)
    .sort((a, b) => a.shift_date.toISOString().split(":")[0] === today);



  

  const time = (time) => {
    let t = Number(time.split(":")[0]);
    if (t > 12) {
      t =
        "0" +
        String(t - 12) +
        ":" +
        time.split(":")[1] +
        ":" +
        time.split(":")[2];
      return t + "PM";
    } else {
      t = time;
      return t + "AM";
    }
  };

  const fetch = async () => {
    await getShifts();
  }

  useEffect(() => {
    fetch()
  }, [shifts]);
  return (
    <div className="min-h-screen ">
      <nav className="flex items-center justify-between px-8 py-4 border-b">
        <div className="flex items-center gap-2">
          <span className="font-bold">ShiftMaster</span>
        </div>
        <div className="flex items-center gap-8">
          <button className="text-blue-600 font-medium">My Shifts</button>
          <div className="flex items-center gap-3">
            <p className="text-sm font-bold">
              {employee?.name}
              <span className="block text-xs font-normal text-right">
                Employee
              </span>
            </p>
            <button className=" flex gap-2">
              <Settings onClick={() => navigate("/settings")} />
              <LogOut onClick={() => logout()} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-12">
        <h1 className="text-4xl font-bold mb-2">Hello, {employee?.name}</h1>
        <p className=" mb-12 text-lg">
          Here is your upcoming schedule.
        </p>

        {/* Highlighted Next Shift */}
        {currentShift?.length > 0 ? (
          <div className="bg-blue-600 rounded-3xl p-10 text-white mb-10">
            <div className="flex items-center gap-2 mb-4">
              <ClockIcon /> <span>Current Shift</span>
            </div>
            <p className="text-2xl opacity-90 mb-6">
              {timeCalculation(
                currentShift[0]?.start_time,
                currentShift[0]?.end_time,
              )}
            </p>
            <p className="text-blue-100 italic">Don't be late!</p>
          </div>
        ) : (
          <div className="bg-blue-600 rounded-3xl p-10 text-white mb-10 shadow-xl shadow-blue-100">
            <div className="flex items-center gap-2 mb-4">
              <ClockIcon /> <span>Current Shift</span>
            </div>
            <h2 className="text-5xl font-bold mb-2"></h2>
            <p className="text-2xl opacity-90 mb-6">---|---</p>
            <p className="text-blue-100 italic">The task is not assigned.</p>
          </div>
        )}

        {/* Upcoming List */}
        {sortedShifts.length > 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8">
            <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
              <CalendarIcon /> Upcoming Shifts
            </h3>
            <p className="text-slate-500 mb-8">
              Your schedule for the next few days
            </p>
            {sortedShifts.map((shift) => (
              <div
                key={shift.id}
                className="border border-slate-100 rounded-2xl p-6 w-full"
              >
                <span className="bg-slate-100 px-3 py-1 rounded-full text-xs font-bold mb-4 inline-block">
                  {shift.shift_date.split("T")[0]}
                </span>
                <h4 className="text-3xl font-bold">{time(shift.start_time)}</h4>
                <p className="text-slate-400">until {time(shift.end_time)}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-8">
            <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
              <CalendarIcon /> Upcoming Shifts
            </h3>
            <p className="text-slate-500 mb-8">
              Your schedule for the next few days
            </p>

            <div className="border border-slate-100 rounded-2xl p-6 w-1/3">
              <h4 className="text-3xl font-bold">---|---</h4>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default EmployeeDashboard;
