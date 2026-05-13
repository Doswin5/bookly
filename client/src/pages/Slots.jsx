import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import AppLayout from "../layouts/AppLayout";
import SlotCard from "../components/SlotCard";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";

export default function Slots() {
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [bookingSlotId, setBookingSlotId] = useState(null);

  const fetchSlots = async () => {
    try {
      setLoading(true);

      const query = selectedDate
        ? `/slots?status=available&date=${selectedDate}`
        : "/slots?status=available";

      const res = await api.get(query);
      setSlots(res.data.slots);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch slots");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [selectedDate]);

  const handleBookSlot = async (slotId) => {
    try {
      setBookingSlotId(slotId);

      await api.post("/bookings", {
        slotId,
      });

      toast.success("Slot booked successfully");

      setSlots((prev) => prev.filter((slot) => slot._id !== slotId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to book slot");
      fetchSlots();
    } finally {
      setBookingSlotId(null);
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-bold">Available Slots</h1>
          <p className="mt-2 text-slate-400">
            Choose an open appointment time and book it.
          </p>
        </div>

        <div>
          <label className="text-sm text-slate-300">Filter by date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="mt-2 block rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {loading ? (
        <LoadingState text="Loading slots..." />
      ) : slots.length === 0 ? (
        <EmptyState
          title="No available slots"
          message="Try another date or check back later."
        />
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {slots.map((slot) => (
            <SlotCard
              key={slot._id}
              slot={slot}
              onBook={handleBookSlot}
              booking={bookingSlotId === slot._id}
            />
          ))}
        </div>
      )}
    </AppLayout>
  );
}
