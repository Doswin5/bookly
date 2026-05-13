import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import AppLayout from "../layouts/AppLayout";
import BookingCard from "../components/BookingCard";
import ConfirmModal from "../components/ConfirmModal";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

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
      setSelectedBookingId(null);
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId
            ? {
                ...booking,
                status: "cancelled",
                cancelledAt: new Date().toISOString(),
              }
            : booking,
        ),
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
        <LoadingState text="Loading bookings..." />
      ) : bookings.length === 0 ? (
        <EmptyState
          title="No bookings yet"
          message="Book an available slot to see it here."
        />
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {bookings.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              onCancel={setSelectedBookingId}
              cancelling={cancellingId === booking._id}
            />
          ))}
        </div>
      )}

      <ConfirmModal
        open={Boolean(selectedBookingId)}
        title="Cancel booking?"
        message="This will cancel your appointment and make the slot available again."
        confirmText="Cancel booking"
        loading={Boolean(cancellingId)}
        onClose={() => setSelectedBookingId(null)}
        onConfirm={() => handleCancelBooking(selectedBookingId)}
      />
    </AppLayout>
  );
}
