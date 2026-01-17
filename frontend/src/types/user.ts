export interface User {
  id: number;
  tenantId: number;
  email: string;
  firstName: string;
  lastName: string;
  department: string;
  role: string;
  status: "active" | "inactive" | "suspended" | "pending";
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  department: string;
  role: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  department?: string;
  role?: string;
  status?: "active" | "inactive" | "suspended" | "pending";
}
