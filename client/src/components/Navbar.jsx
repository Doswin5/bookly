import { Link, NavLink, useNavigate } from "react-router";
import { CalendarCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm ${
      isActive
        ? "bg-slate-800 text-white"
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <header className="border-b border-slate-800 bg-slate-950/90">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
            <CalendarCheck size={22} />
          </span>

          <div>
            <p className="font-bold leading-none">BookWise</p>
            <p className="text-xs text-slate-500">Appointment System</p>
          </div>
        </Link>

        {user ? (
          <div className="flex items-center gap-2">
            {user.role === "admin" ? (
              <>
                <NavLink to="/admin/slots" className={navLinkClass}>
                  Slots
                </NavLink>

                <NavLink to="/admin/bookings" className={navLinkClass}>
                  Bookings
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/slots" className={navLinkClass}>
                  Available Slots
                </NavLink>

                <NavLink to="/bookings" className={navLinkClass}>
                  My Bookings
                </NavLink>
              </>
            )}

            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold hover:bg-indigo-500"
            >
              Register
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}