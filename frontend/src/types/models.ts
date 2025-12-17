export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  location: string;
  description?: string;
  amenities: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

export interface CreateRoomData {
  name: string;
  capacity: number;
  location: string;
  description?: string;
  amenities: string[];
}

export interface UpdateUserData extends Partial<Omit<CreateUserData, 'password'>> {
  id: string;
  password?: string;
}

export interface UpdateRoomData extends Partial<CreateRoomData> {
  id: string;
  isActive?: boolean;
}
