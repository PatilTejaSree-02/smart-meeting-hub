import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const { logout } = useAuth(); // ✅ from your AuthContext

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();          // ✅ clears token/user from context
    navigate("/");     // ✅ back to login page
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex">
      {/* LEFT SIDEBAR */}
      <aside className="w-64 min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-teal-500/20 border border-white/10 flex items-center justify-center">
            <span className="text-lg font-bold">📄</span>
          </div>
          <div>
            <p className="text-sm text-white/60 leading-none">SMRMS</p>
            <p className="text-base font-semibold leading-none">Admin Panel</p>
          </div>
        </div>

        {/* Menu */}
        <div className="px-4 py-4">
          <p className="text-xs uppercase tracking-wider text-white/40 px-2 mb-3">
            Administration
          </p>

          <nav className="space-y-1">
            <SidebarLink
              to="/admin/dashboard"
              label="Dashboard"
              active={isActive("/admin/dashboard")}
            />
            <SidebarLink
              to="/admin/rooms"
              label="Manage Rooms"
              active={isActive("/admin/rooms")}
            />
            <SidebarLink
              to="/admin/users"
              label="Manage Users"
              active={isActive("/admin/users")}
            />
            <SidebarLink
              to="/admin/bookings"
              label="All Bookings"
              active={isActive("/admin/bookings")}
            />
            <SidebarLink
              to="/admin/analytics"
              label="Analytics"
              active={isActive("/admin/analytics")}
            />
          </nav>
        </div>

        {/* ✅ Bottom area (Always Visible) */}
        <div className="mt-auto p-4 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
            <div className="h-10 w-10 rounded-full bg-teal-500/20 flex items-center justify-center font-bold">
              A
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold leading-none">Admin</p>
              <p className="text-xs text-white/50">ROLE_ADMIN</p>
            </div>
          </div>

          {/* ✅ Working Logout */}
          <button
            onClick={handleLogout}
            className="mt-3 w-full rounded-xl bg-white/10 hover:bg-white/20 transition px-3 py-2 text-sm font-semibold"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN SECTION */}
      <div className="flex-1 min-h-screen">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
          <input
            placeholder="Search rooms, bookings..."
            className="w-full max-w-md rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition"
          />

          <div className="flex items-center gap-3">
            <button className="h-10 w-10 rounded-xl bg-slate-100 hover:bg-slate-200 transition">
              🔔
            </button>
            <div className="h-10 w-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

/* Sidebar Link Component */
function SidebarLink({ to, label, active }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition
        ${
          active
            ? "bg-teal-500 text-white shadow-lg shadow-teal-500/20"
            : "text-white/80 hover:bg-white/10 hover:text-white"
        }`}
    >
      <span className="h-2 w-2 rounded-full bg-white/40"></span>
      {label}
    </Link>
  );
}
