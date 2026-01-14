import { Link, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen">
      <nav className="bg-gray-900 text-white px-6 py-4 flex gap-6">
        <Link to="/admin/dashboard">Admin Dashboard</Link>
        <Link to="/admin/rooms">Rooms</Link>
        <Link to="/admin/bookings">Bookings</Link>
        <Link to="/admin/users">Users</Link>
        <Link to="/admin/analytics">Analytics</Link>
      </nav>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
