import React, { useState } from "react";
import { X } from "lucide-react";
import { UseEmployeeStore } from "../store/StateManager";
import toast from "react-hot-toast";

// Shift assignment modal
const ShiftEdit = ({ setShow }) => {
  // Get employee list and addShift action from store
  const { employee, addShift } = UseEmployeeStore();
  const [loading, setLoading] = useState(false);
  // Local form state
  const [form, setForm] = useState({
    employeeId: "",
    date: "",
    startTime: "",
    endTime: "",
  });

  // Form submit handler
  const submitHandler = async (e) => {
    e.preventDefault(); // Prevent page reload

    // Validation: ensure all fields are filled
    if (!form.employeeId || !form.date || !form.startTime || !form.endTime) {
      toast.error("Please fill all fields");
      return;
    }

    // Optional formatting (date normalization)
    form.date = form.date.split(":")[0];
    setLoading(true);
    // Call backend/store to add shift
    await addShift(form);
    setLoading(false)
    // Close modal after successful submission
    setShow(false);
  };

  return (
    // Modal overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      {/* Modal form */}
      <form
        onSubmit={submitHandler}
        className="bg-white w-[420px] rounded-xl shadow-lg p-6 relative"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={() => setShow(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>

        {/* Title */}
        <h2 className="text-lg font-semibold mb-6">Assign New Shift</h2>

        {/* Employee selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Employee</label>
          <select
            value={form.employeeId}
            onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Select employee</option>
            {employee.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Time inputs */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Start time */}
          <div>
            <label className="block text-sm font-medium mb-1">Start Time</label>
            <input
              type="time"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* End time */}
          <div>
            <label className="block text-sm font-medium mb-1">End Time</label>
            <input
              type="time"
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium"
        >
          {!loading ? "Assign Shift" : "Assigning..."}
        </button>
      </form>
    </div>
  );
};

export default ShiftEdit;
