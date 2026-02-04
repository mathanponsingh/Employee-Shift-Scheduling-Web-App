import React, { useState } from "react"
import { UseEmployeeStore } from "../store/StateManager";

const UpdateEmployee = ({ name, email, id, setIsEditOpen }) => {
  // Get update function from store
  const { updateEmployee } = UseEmployeeStore();

  // Local form state (controlled inputs)
  const [formData, setFormData] = useState({
    id, 
    email: "", 
    name: "", 
  });

  // Submit handler
  const Handler = async (e) => {
    e.preventDefault(); // Prevent page reload
    await updateEmployee(formData);
    setIsEditOpen(false);
  };

  return (
    // Modal overlay
    <div className="fixed inset-0 bg-black/20">
      <div className="h-full w-full flex items-center justify-center">
        {/* Edit form */}
        <form onSubmit={Handler} className="bg-white p-3 rounded">
          {/* Title */}
          <div className="w-full flex justify-center">
            <h1 className="font-semibold">Edit Employee</h1>
          </div>

          {/* Name input */}
          <div className="w-full border-b mt-2">
            <input
              className="text-black outline-none"
              type="text"
              placeholder={name}
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              required
            />
          </div>

          {/* Email input */}
          <div className="w-full border-b mt-2">
            <input
              type="email"
              className="text-black outline-none"
              placeholder={email}
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              required
            />
          </div>

          {/* Action buttons */}
          <div className="flex w-full justify-center gap-2 p-2">
            {/* Save button */}
            <button
              type="submit"
              className="p-2 bg-green-500 rounded text-white active:scale-90 hover:bg-green-600"
            >
              Save
            </button>

            {/* Cancel button */}
            <button
              type="button"
              className="p-2 bg-red-500 rounded text-white active:scale-90 hover:bg-red-600"
              onClick={() => setIsEditOpen(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateEmployee;
