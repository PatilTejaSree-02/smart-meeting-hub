import { useEffect, useState } from "react";
import {
  getAdminUsers,
  createUser,
  updateUser,
  deactivateUser,
} from "@/api/adminUsersApi";
import { User } from "@/types/user";

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ROLE_USER");

  const tenantId = 1;

  const loadUsers = () => {
    getAdminUsers(tenantId).then(setUsers);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = async () => {
    await createUser({
      email,
      password,
      role,
      tenantId,
    });

    setEmail("");
    setPassword("");
    setRole("ROLE_USER");
    loadUsers();
  };

  const toggleActive = async (user: User) => {
    await updateUser(user.id, {
      active: !user.active,
    });
    loadUsers();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin – Manage Users</h1>

      {/* CREATE USER */}
      <div className="border rounded-lg p-4 mb-6">
        <h2 className="font-semibold mb-2">Add New User</h2>

        <input
          className="border p-2 mr-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border p-2 mr-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
          className="border p-2 mr-2"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="ROLE_USER">User</option>
          <option value="ROLE_ADMIN">Admin</option>
        </select>

        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add User
        </button>
      </div>

      {/* USER LIST */}
      <div className="space-y-4">
        {users.map((u) => (
          <div
            key={u.id}
            className="border rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{u.email}</p>
              <p className="text-sm">Role: {u.role}</p>
              <p className="text-sm">
                Status: {u.active ? "Active" : "Inactive"}
              </p>
            </div>

            <button
              onClick={() => toggleActive(u)}
              className={`px-3 py-1 rounded ${
                u.active
                  ? "bg-red-600 text-white"
                  : "bg-green-600 text-white"
              }`}
            >
              {u.active ? "Deactivate" : "Activate"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
