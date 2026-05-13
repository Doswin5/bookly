import { Link } from "react-router";
import { CalendarCheck, ShieldCheck, Clock, UserCog } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  const dashboardLink = user?.role === "admin" ? "/admin/slots" : "/slots";

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-6 flex w-fit items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">
            <CalendarCheck size={16} />
            Real-world appointment booking system
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Book appointments without double bookings.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            BookWise lets users reserve available time slots while the backend
            controls booking rules, slot status, and access permissions.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {user ? (
              <Link
                to={dashboardLink}
                className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold hover:bg-indigo-500"
              >
                Go to dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold hover:bg-indigo-500"
                >
                  Create account
                </Link>

                <Link
                  to="/login"
                  className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-300 hover:bg-slate-900 hover:text-white"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<Clock size={22} />}
            title="Available slots"
            text="Users only see bookable appointment times."
          />

          <FeatureCard
            icon={<ShieldCheck size={22} />}
            title="Double-booking protection"
            text="Backend checks stop users from booking the same slot."
          />

          <FeatureCard
            icon={<UserCog size={22} />}
            title="Admin controls"
            text="Service providers create slots and manage bookings."
          />

          <FeatureCard
            icon={<CalendarCheck size={22} />}
            title="Booking history"
            text="Users can view and cancel their own bookings."
          />
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-indigo-300">
        {icon}
      </div>

      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
    </div>
  );
}