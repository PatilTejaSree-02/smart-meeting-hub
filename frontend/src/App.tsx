import { Routes, Route } from "react-router-dom";

import Index from "@/pages/Index";
import Rooms from "@/pages/Rooms";
import MyBookings from "@/pages/MyBookings";

import AdminRooms from "@/pages/admin/AdminRooms";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminBookings from "@/pages/admin/AdminBookings";
import AdminAnalytics from "@/pages/admin/AdminAnalytics";
import AdminDashboard from "@/pages/admin/AdminDashboard";

import UserDashboard from "./pages/user/UserDashboard";
import UserBookings from "./pages/user/UserBookings";
import BookingHistory from "./pages/user/BookingHistory";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import UserLayout from "@/components/layout/UserLayout";
import AdminLayout from "@/components/layout/AdminLayout";

export default function App() {
  return (
    <Routes>

      {/* PUBLIC */}
      <Route path="/" element={<Index />} />

      {/* USER AREA */}
      <Route element={<ProtectedRoute />}>
  <Route element={<UserLayout />}>
    <Route path="/dashboard" element={<UserDashboard />} />
    <Route path="/bookings" element={<UserBookings />} />
    <Route path="/history" element={<BookingHistory />} />
    <Route path="/rooms" element={<Rooms />} />
  </Route>
</Route>

      {/* ADMIN AREA */}
      <Route element={<ProtectedRoute adminOnly />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/rooms" element={<AdminRooms />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<p>Not Found</p>} />

    </Routes>
  );
}
