import { CalendarClock } from "lucide-react";
import { formatDateTime } from "../utils/formatDateTime";

export default function BookingCard({ booking, onCancel, cancelling }) {
  const isCancelled = booking.status === "cancelled";
  const isPast = new Date(booking.slot.startTime) <= new Date();

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">
            {booking.slot.serviceName}
          </h3>

          <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">
            <CalendarClock size={16} />
            <span>
              {formatDateTime(booking.slot.startTime)} -{" "}
              {formatDateTime(booking.slot.endTime)}
            </span>
          </div>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            isCancelled
              ? "bg-red-500/10 text-red-400"
              : "bg-emerald-500/10 text-emerald-400"
          }`}
        >
          {booking.status}
        </span>
      </div>

      {booking.notes && (
        <p className="mt-4 rounded-xl bg-slate-950 p-3 text-sm text-slate-400">
          {booking.notes}
        </p>
      )}

      <button
        onClick={() => onCancel(booking._id)}
        disabled={isCancelled || isPast || cancelling}
        className="mt-5 w-full rounded-xl border border-red-500/30 py-3 font-semibold text-red-400 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:border-slate-700 disabled:text-slate-500"
      >
        {cancelling
          ? "Cancelling..."
          : isCancelled
          ? "Cancelled"
          : isPast
          ? "Past booking"
          : "Cancel booking"}
      </button>
    </div>
  );
}