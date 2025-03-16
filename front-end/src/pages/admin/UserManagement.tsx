import { useState, useEffect } from "react";
import axios from "axios";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  department: string;
  gender: string;
  phoneNumber: string;
  skills?: string;
  bio?: string;
  linkedIn?: string;
  github?: string;
  twitter?: string;
  interests?: string;
  companyName?: string;
  batch: string;
  role: "admin" | "user" | "alumini";
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<"admin" | "user" | "alumini">(
    "admin"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/admin/getAllUsers"
        );
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);
  const filteredUsers = users.filter((user) => user.role === activeTab);

  const handleSave = async () => {
    if (!selectedUser) return;

    try {
      await axios.patch(
        `http://localhost:8000/user/updateUserProfile/${selectedUser._id}`,
        selectedUser
      );
      setUsers(
        users.map((user) =>
          user._id === selectedUser._id ? selectedUser : user
        )
      );
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Handle Delete
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8000/admin/deleteUser/${id}`);
      setUsers(users.filter((user) => user._id !== id)); // Remove from UI
      alert("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>

      {/* Tabs */}
      <div className="flex space-x-4 border-b">
        {["admin", "user", "alumini"].map((role) => (
          <button
            key={role}
            className={`px-4 py-2 ${
              activeTab === role ? "border-b-2 border-blue-500 font-bold" : ""
            }`}
            onClick={() => setActiveTab(role as "admin" | "user" | "alumini")}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>

      {/* User List */}
      <div className="mt-4">
        {filteredUsers.length === 0 ? (
          <p>No {activeTab} users found.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Role</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="border">
                  <td className="border p-2">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2">{user.role}</td>
                  <td className="border p-2 flex space-x-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {isModalOpen && selectedUser && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-1/3">
              <h3 className="text-xl font-bold mb-4">Edit User</h3>
              <input
                type="text"
                value={selectedUser.firstName}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    firstName: e.target.value,
                  })
                }
                className="w-full p-2 border rounded mb-2"
                placeholder="First Name"
              />
              <input
                type="text"
                value={selectedUser.lastName}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, lastName: e.target.value })
                }
                className="w-full p-2 border rounded mb-2"
                placeholder="Last Name"
              />
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded mr-2"
              >
                Save
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
