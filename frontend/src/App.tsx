import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// USER LAYOUT + PAGES
import Dashboard from "./pages/Dashboard";
import Rooms from "./pages/Rooms";
import RoomDetails from "./pages/RoomDetails";
import MyBookings from "./pages/MyBookings";
import UserLayout from "./components/layout/UserLayout";

// ADMIN PAGES
import AdminRooms from "./pages/admin/AdminRooms";
import AdminUsers from "./pages/admin/AdminUsers";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* USER AREA */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/bookings" element={<MyBookings />} />
        </Route>

        {/* ADMIN AREA */}
        <Route path="/admin/rooms" element={<AdminRooms />} />
        <Route path="/admin/users" element={<AdminUsers />} />

        {/* FALLBACK */}
        <Route path="*" element={<p>Page Not Found</p>} />

      </Routes>
    </BrowserRouter>
  );
}
