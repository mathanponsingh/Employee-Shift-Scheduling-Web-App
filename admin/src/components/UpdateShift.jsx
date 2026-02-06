import React, { useState } from "react";
import { X } from "lucide-react"
import { UseEmployeeStore } from "../store/StateManager";

// Modal component for updating an existing shift
const UpdateShift = ({ id, name, setShowUpdate }) => {

  const { updateShifts } = UseEmployeeStore();
  const [ loading, setLoading] = useState(false)
  // Local form state
  const [form, setForm] = useState({
    id, 
    date: "", 
    startTime: "",
    endTime: "",
  });

  // Form submit handler
  const submitHandler = async (e) => {
    e.preventDefault(); // Prevent page reload
    setLoading(true)
    // Call update shift action
    await updateShifts(form);
    setLoading(false)
    // Close modal after update
    setShowUpdate(false);
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
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={18} onClick={() => setShowUpdate(false)} />
        </button>

        {/* Title */}
        <h2 className="text-lg font-semibold mb-6">Update Shift</h2>

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
          {!loading ? "Assign Shift" : "Assigning"}
        </button>
      </form>
    </div>
  );
};

export default UpdateShift;
