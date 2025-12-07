export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  avatar?: string;
  createdAt: Date;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  floor: number;
  amenities: string[];
  image: string;
  isActive: boolean;
  description?: string;
}

export interface TimeSlot {
  start: string;
  end: string;
}

export interface Booking {
  id: string;
  roomId: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  attendees: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: Date;
  room?: Room;
  user?: User;
}

export interface RoomFilter {
  date?: string;
  capacity?: number;
  floor?: number;
  amenities?: string[];
}

export interface AnalyticsData {
  totalBookings: number;
  totalRooms: number;
  totalUsers: number;
  averageOccupancy: number;
  bookingsByRoom: { roomName: string; count: number }[];
  bookingsByDay: { day: string; count: number }[];
  peakHours: { hour: string; count: number }[];
}

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};
