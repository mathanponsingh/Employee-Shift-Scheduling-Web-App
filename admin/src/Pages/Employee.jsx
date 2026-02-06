import React, { useEffect, useState } from "react";
import AddEmployeeModal from "../components/EmployeeEdit";
import Header from "../components/Header";
import UpdateEmployee from "../components/UpdateEmployee";
import { UseEmployeeStore } from "../store/StateManager";
import { Pencil, Trash2 } from "lucide-react";

// Employees page component
const EmployeesPage = () => {
  // Extract state and actions from store
  const {
    getEmployee,
    employee,
    pagination,
    loading,
    deleteEmployee,
    getAdmins,
    admins,
  } = UseEmployeeStore();

  // Pagination & search state
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input (wait 500ms before API call)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page when search changes
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  // Fetch employees when page or search changes
  useEffect(() => {
    getEmployee({ page, search: debouncedSearch });
  }, [page, debouncedSearch]);

  // Fetch admin list
  useEffect(() => {
      getAdmins();
  }, []);

  // Utility function: get initials from name
  const getInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <div className="p-6 border">
      {/* Top header */}
      <Header />

      {/* Page header */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
  <h2 className="text-2xl font-bold">Employees</h2>

  {/* Search + Add */}
  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
    <input
      type="text"
      placeholder="Search employees..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full sm:w-64 px-4 py-2 border rounded-md 
                 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <button
      onClick={() => setIsModalOpen(true)}
      className="bg-blue-600 cursor-pointer px-4 py-2 rounded-md 
                 hover:bg-blue-700 transition whitespace-nowrap"
    >
      + Add Employee
    </button>
  </div>
</div>


      <p className="text-gray-500 mb-4">Manage your team members and roles.</p>

      {/* Employee table */}
      <table className="w-full border border-gray-200 rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border-b">Name</th>
            <th className="p-3 border-b">Role</th>
            <th className="p-3 border-b">Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="3" className="p-4 text-center">
                Loading...
              </td>
            </tr>
          ) : employee.length === 0 ? (
            <tr>
              <td colSpan="3" className="p-4 text-center text-gray-500">
                No employees found
              </td>
            </tr>
          ) : (
            employee.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-50">
                {/* Name + avatar */}
                <td className="flex items-center gap-3 p-3 border-b">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
                    {getInitials(emp.name)}
                  </div>
                  <span>{emp.name}</span>
                </td>

                {/* Role */}
                <td className="p-3 border-b">
                  <span className="bg-gray-100 px-2 py-1 rounded-md text-sm">
                    {emp.role}
                  </span>
                </td>

                {/* Actions */}
                <td className="p-3 border-b space-x-4">
                  <Trash2
                    size={18}
                    className="inline cursor-pointer text-red-500 hover:text-red-700"
                    onClick={() => deleteEmployee(emp.id)}
                  />
                  <Pencil
                    size={18}
                    className="inline cursor-pointer text-gray-500 hover:text-gray-600"
                    onClick={() => setEditingEmployee(emp)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {pagination && (
        <div className="flex justify-between items-center mt-4 mb-8">
          <span className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.totalPages} (
            {pagination.total} employees)
          </span>

          <div className="flex gap-2">
            <button
              disabled={pagination.page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              disabled={pagination.page === pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Admin list */}
      <table className="w-full border mt-3 border-gray-200 rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border-b">Admins</th>
          </tr>
        </thead>

        <tbody>
          {admins.length === 0 ? (
            <tr>
              <td className="p-4 text-center text-gray-500">No admins found</td>
            </tr>
          ) : (
            admins.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-50">
                <td className="flex items-center gap-3 p-3 border-b">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
                    {getInitials(emp.name)}
                  </div>
                  <span>{emp.name}</span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Add employee modal */}
      <AddEmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Edit employee modal */}
      {editingEmployee && (
        <UpdateEmployee
          id={editingEmployee.id}
          name={editingEmployee.name}
          email={editingEmployee.email}
          setIsEditOpen={() => setEditingEmployee(null)}
        />
      )}
    </div>
  );
};

export default EmployeesPage;
