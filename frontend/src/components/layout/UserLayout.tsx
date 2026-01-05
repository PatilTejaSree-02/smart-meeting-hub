import { Link, Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <div className="min-h-screen">
      <nav className="bg-blue-600 text-white px-6 py-4 flex gap-6">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/rooms">Rooms</Link>
        <Link to="/bookings">My Bookings</Link>
      </nav>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
