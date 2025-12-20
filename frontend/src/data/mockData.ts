// ================================
// MOCK DATA (UI / ANALYTICS ONLY)
// ================================

// ---------- ROOMS ----------
export const mockRooms = [
  {
    id: 1,
    name: "Innovation Hub",
    capacity: 12,
    floor: 3,
    building: "Main Building",
    status: "active",
  },
  {
    id: 2,
    name: "Creative Studio",
    capacity: 8,
    floor: 2,
    building: "Main Building",
    status: "active",
  },
  {
    id: 3,
    name: "Executive Boardroom",
    capacity: 20,
    floor: 5,
    building: "Main Building",
    status: "active",
  },
];

// ---------- USERS ----------
export const mockUsers = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@acme.com",
    role: "admin",
  },
  {
    id: 2,
    name: "Sarah Wilson",
    email: "sarah.wilson@acme.com",
    role: "user",
  },
];

// ---------- BOOKINGS ----------
export const mockBookings = [
  {
    id: 1,
    roomName: "Innovation Hub",
    bookedBy: "Sarah Wilson",
    date: "2025-12-20",
    startTime: "10:00",
    endTime: "11:00",
    status: "confirmed",
  },
  {
    id: 2,
    roomName: "Creative Studio",
    bookedBy: "Mike Johnson",
    date: "2025-12-21",
    startTime: "14:00",
    endTime: "15:30",
    status: "completed",
  },
];

// ---------- AMENITIES ----------
export const amenitiesList = [
  { id: 1, name: "Projector" },
  { id: 2, name: "Whiteboard" },
  { id: 3, name: "Video Conference" },
  { id: 4, name: "WiFi" },
  { id: 5, name: "Air Conditioning" },
];

// ---------- ANALYTICS ----------
export const mockAnalytics = {
  totalBookings: 128,
  totalRooms: 8,
  totalUsers: 24,
  averageOccupancy: 67,

  bookingsByRoom: [
    { roomName: "Innovation Hub", count: 38 },
    { roomName: "Creative Studio", count: 24 },
    { roomName: "Executive Boardroom", count: 42 },
    { roomName: "Focus Pod", count: 24 },
  ],

  bookingsByDay: [
    { day: "Mon", count: 22 },
    { day: "Tue", count: 19 },
    { day: "Wed", count: 27 },
    { day: "Thu", count: 31 },
    { day: "Fri", count: 29 },
  ],

  peakHours: [
    { hour: "09 AM", count: 18 },
    { hour: "10 AM", count: 26 },
    { hour: "11 AM", count: 21 },
    { hour: "02 PM", count: 29 },
    { hour: "04 PM", count: 34 },
  ],
};
