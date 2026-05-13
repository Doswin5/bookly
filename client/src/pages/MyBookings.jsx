import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import AppLayout from "../layouts/AppLayout";
import BookingCard from "../components/BookingCard";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const res = await api.get("/bookings/my");
      setBookings(res.data.bookings);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    try {
      setCancellingId(bookingId);

      await api.patch(`/bookings/${bookingId}/cancel`);

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
      <div>
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <p className="mt-2 text-slate-400">
          View and manage your appointment bookings.
        </p>
      </div>

      {loading ? (
        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
          Loading bookings...
        </div>
      ) : bookings.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
          <h2 className="text-xl font-semibold">No bookings yet</h2>
          <p className="mt-2 text-slate-400">
            Book an available slot to see it here.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {bookings.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              onCancel={handleCancelBooking}
              cancelling={cancellingId === booking._id}
            />
          ))}
        </div>
      )}
    </AppLayout>
  );
}