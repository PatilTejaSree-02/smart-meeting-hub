export interface User {
  id: number;
  email: string;
  role: string;
  active: boolean;
  tenantId: number;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  role: string;
  tenantId: number;
}

export interface UpdateUserRequest {
  role?: string;
  active?: boolean;
}
