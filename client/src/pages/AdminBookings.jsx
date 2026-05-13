import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import AppLayout from "../layouts/AppLayout";
import { formatDateTime } from "../utils/formatDateTime";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (status) params.append("status", status);
      if (date) params.append("date", date);

      const query = params.toString()
        ? `/bookings/admin/all?${params.toString()}`
        : "/bookings/admin/all";

      const res = await api.get(query);
      setBookings(res.data.bookings);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [status, date]);

  const handleCancelBooking = async (bookingId) => {
    try {
      setCancellingId(bookingId);

      await api.patch(`/bookings/admin/${bookingId}/cancel`);

      toast.success("Booking cancelled successfully");

      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId
            ? {
                ...booking,
                status: "cancelled",
                cancelledAt: new Date().toISOString()
              }
            : booking
        )
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-bold">Admin Bookings</h1>
          <p className="mt-2 text-slate-400">
            View and manage all user appointments.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div>
            <label className="text-sm text-slate-300">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-2 block w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-indigo-500"
            >
              <option value="">All</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-slate-300">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-2 block rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
          Loading bookings...
        </div>
      ) : bookings.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
          <h2 className="text-xl font-semibold">No bookings found</h2>
          <p className="mt-2 text-slate-400">
            Try changing the filters or check again later.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {bookings.map((booking) => {
            const isCancelled = booking.status === "cancelled";
            const working = cancellingId === booking._id;

            return (
              <div
                key={booking._id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
              >
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {booking.slot?.serviceName || "Deleted slot"}
                    </h3>

                    <p className="mt-2 text-sm text-slate-400">
                      {booking.slot
                        ? `${formatDateTime(
                            booking.slot.startTime
                          )} - ${formatDateTime(booking.slot.endTime)}`
                        : "Slot details unavailable"}
                    </p>

                    <div className="mt-4 rounded-xl bg-slate-950 p-4 text-sm">
                      <p className="text-slate-300">
                        <span className="text-slate-500">User:</span>{" "}
                        {booking.user?.name || "Unknown user"}
                      </p>

                      <p className="mt-1 text-slate-300">
                        <span className="text-slate-500">Email:</span>{" "}
                        {booking.user?.email || "No email"}
                      </p>

                      {booking.notes && (
                        <p className="mt-3 text-slate-400">
                          <span className="text-slate-500">Notes:</span>{" "}
                          {booking.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-3 lg:items-end">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        isCancelled
                          ? "bg-red-500/10 text-red-400"
                          : "bg-emerald-500/10 text-emerald-400"
                      }`}
                    >
                      {booking.status}
                    </span>

                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      disabled={isCancelled || working}
                      className="rounded-xl border border-red-500/30 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:border-slate-700 disabled:text-slate-500"
                    >
                      {working
                        ? "Cancelling..."
                        : isCancelled
                        ? "Cancelled"
                        : "Cancel booking"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
}