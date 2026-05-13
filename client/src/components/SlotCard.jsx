import { Clock } from "lucide-react";
import { formatDateTime } from "../utils/formatDateTime";

export default function SlotCard({ slot, onBook, booking }) {
  const isAvailable = slot.status === "available";

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{slot.serviceName}</h3>

          <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">
            <Clock size={16} />
            <span>
              {formatDateTime(slot.startTime)} - {formatDateTime(slot.endTime)}
            </span>
          </div>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            isAvailable
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {slot.status}
        </span>
      </div>

      <button
        onClick={() => onBook(slot._id)}
        disabled={!isAvailable || booking}
        className="mt-5 w-full rounded-xl bg-indigo-600 py-3 font-semibold hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
      >
        {booking ? "Booking..." : isAvailable ? "Book slot" : "Unavailable"}
      </button>
    </div>
  );
}