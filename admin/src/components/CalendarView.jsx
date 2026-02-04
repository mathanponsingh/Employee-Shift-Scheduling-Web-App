// React import
import React from "react";

// date-fns utilities for calendar calculations
import {
  format, // format date (e.g., Month Year)
  startOfMonth, // first day of month
  endOfMonth, // last day of month
  startOfWeek, // first day of week (Sunday)
  endOfWeek, // last day of week (Saturday)
  eachDayOfInterval, // generate all days between two dates
  isSameMonth, // check same month
  isSameDay, // check same day
  isToday, // check today
} from "date-fns";

// Icons for navigation
import { ChevronLeft, ChevronRight } from "lucide-react";

// Calendar component
const CalendarView = ({ shifts, currentDate, setCurrentDate }) => {
  // Move to next month
  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  // Move to previous month
  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  // Get first and last day of the current month
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);

  // Get calendar start and end (full weeks)
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  // Generate all calendar days
  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  // Weekday headers
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Get shifts for a specific day
  const getShiftsForDay = (day) => {
    return shifts.filter((shift) => isSameDay(new Date(shift.shift_date), day));
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* Header section */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          {format(currentDate, "MMMM yyyy")}
        </h2>

        {/* Month navigation */}
        <div className="flex gap-2">
          <button
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 mb-4 border-b pb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const dayShifts = getShiftsForDay(day);

          return (
            <div
              key={day.toString()}
              className={`min-h-[100px] border rounded-lg p-2
                ${
                  !isSameMonth(day, monthStart)
                    ? "bg-gray-50 text-gray-400"
                    : "bg-white"
                }
                ${
                  isToday(day)
                    ? "border-blue-500 ring-1 ring-blue-500"
                    : "border-gray-200"
                }
              `}
            >
              {/* Date and shift count */}
              <div className="flex justify-between items-start mb-1">
                <span
                  className={`text-sm font-medium ${
                    isToday(day) ? "text-blue-600" : ""
                  }`}
                >
                  {format(day, "d")}
                </span>

                {dayShifts.length > 0 && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                    {dayShifts.length}
                  </span>
                )}
              </div>

              {/* Shift list */}
              <div className="space-y-1">
                {dayShifts.slice(0, 3).map((shift) => (
                  <div
                    key={shift.id}
                    className="text-xs p-1 bg-blue-50 text-blue-700 rounded truncate"
                    title={`${shift.employee_name}: ${shift.start_time} - ${shift.end_time}`}
                  >
                    <span className="font-semibold">{shift.start_time}</span>{" "}
                    {shift.employee_name}
                  </div>
                ))}

                {/* Extra shifts indicator */}
                {dayShifts.length > 3 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{dayShifts.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
