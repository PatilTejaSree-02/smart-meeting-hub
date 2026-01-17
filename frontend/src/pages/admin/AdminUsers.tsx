import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

import {
  createUser,
  deactivateUser,
  getAdminUsers,
} from "@/api/adminUsersApi";

import { User } from "@/types/user";

export default function AdminUsers() {
  const { toast } = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Create form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [department, setDepartment] = useState("");

  const [role, setRole] = useState("ROLE_USER");

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAdminUsers();
      setUsers(data);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async () => {
    if (!email || !password || !firstName || !lastName || !department) {
      toast({
        title: "Missing fields",
        description: "Fill all fields to create user",
        variant: "destructive",
      });
      return;
    }

    try {
      await createUser({
        email,
        password,
        firstName,
        lastName,
        department,
        role,
      });

      toast({
        title: "User created",
        description: `${email} added successfully`,
      });

      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
      setDepartment("");
      setRole("ROLE_USER");

      loadUsers();
    } catch (err: any) {
      toast({
        title: "Create failed",
        description: err?.response?.data?.message || "Could not create user",
        variant: "destructive",
      });
    }
  };

  const handleDeactivate = async (id: number) => {
    try {
      await deactivateUser(id);

      toast({
        title: "User deactivated",
        description: "User status set to inactive",
      });

      loadUsers();
    } catch (err: any) {
      toast({
        title: "Deactivate failed",
        description: err?.response?.data?.message || "Could not deactivate user",
        variant: "destructive",
      });
    }
  };

  if (loading) return <p className="p-6">Loading users...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin – Manage Users</h1>

      {/* CREATE USER */}
      <div className="border p-4 rounded space-y-3">
        <h2 className="font-semibold">Add New User</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <Input
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <Input
            placeholder="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />

          <Input
            placeholder="Role (ROLE_USER / ROLE_ADMIN)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />

          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button onClick={handleCreateUser}>Add User</Button>
      </div>

      {/* LIST USERS */}
      <div className="space-y-3">
        {users.map((u) => (
          <div
            key={u.id}
            className="border p-4 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">
                {u.firstName} {u.lastName} ({u.role})
              </p>
              <p className="text-sm text-muted-foreground">{u.email}</p>
              <p className="text-sm">Dept: {u.department}</p>
              <p className="text-sm">Status: {u.status}</p>
            </div>

            {u.status === "active" && (
              <Button
                variant="destructive"
                onClick={() => handleDeactivate(u.id)}
              >
                Deactivate
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
