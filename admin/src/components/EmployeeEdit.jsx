import React, { useState } from "react";
import { UseEmployeeStore } from "../store/StateManager";
import toast from "react-hot-toast";

// Modal component for adding employee or admin
const AddEmployeeModal = ({ isOpen, onClose }) => {
  // Extract actions from global store
  const { createEmployee, createAdmin } = UseEmployeeStore();

  // Local state for form inputs
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Employee");

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    // Password validation
    if (password.length < 6) {
      toast.error("Enter password at least 6 characters");
      return;
    }

    // Create admin or employee based on role
    if (role === "Admin") {
      await createAdmin({ name: fullName, email, password });
    } else {
      await createEmployee({ name: fullName, email, password, role });
    }

    // Reset form fields after submission
    setFullName("");
    setEmail("");
    setPassword("");
    setRole("Employee");

    // Close modal
    onClose();
  };

  // Do not render modal if isOpen is false
  if (!isOpen) return null;

  return (
    // Modal overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 bg-opacity-40">
      {/* Modal container */}
      <div className="bg-white rounded-xl shadow-lg w-96 p-6 relative">
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Modal title */}
        <h2 className="text-xl font-semibold mb-4">Add New Employee</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name input */}
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email input */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@gmail.com"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password input */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Role selection */}
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Employee">Employee</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
          >
            Create Employee
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
