import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import AppLayout from "../layouts/AppLayout";
import { formatDateTime } from "../utils/formatDateTime";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import ConfirmModal from "../components/ConfirmModal";

export default function AdminSlots() {
  // States
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [actionId, setActionId] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const [formData, setFormData] = useState({
    serviceName: "",
    startTime: "",
    endTime: "",
  });

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const res = await api.get("/slots");
      setSlots(res.data.slots);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch slots");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreateSlot = async (e) => {
    e.preventDefault();

    if (!formData.serviceName || !formData.startTime || !formData.endTime) {
      toast.error("Please fill in all fields");
      return;
    }

    if (new Date(formData.endTime) <= new Date(formData.startTime)) {
      toast.error("End time must be after start time");
      return;
    }

    try {
      setCreating(true);

      await api.post("/slots", {
        serviceName: formData.serviceName,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
      });

      toast.success("Slot created successfully");

      setFormData({
        serviceName: "",
        startTime: "",
        endTime: "",
      });

      fetchSlots();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create slot");
    } finally {
      setCreating(false);
    }
  };

  const handleCancelSlot = async (slotId) => {
    try {
      setActionId(slotId);

      await api.patch(`/slots/${slotId}/cancel`);

      toast.success("Slot cancelled successfully");

      setSlots((prev) =>
        prev.map((slot) =>
          slot._id === slotId ? { ...slot, status: "cancelled" } : slot,
        ),
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel slot");
    } finally {
      setActionId(null);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    try {
      setActionId(slotId);

      await api.delete(`/slots/${slotId}`);

      toast.success("Slot deleted successfully");

      setSlots((prev) => prev.filter((slot) => slot._id !== slotId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete slot");
    } finally {
      setActionId(null);
    }
  };

  return (
    <AppLayout>
      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h1 className="text-2xl font-bold">Create Slot</h1>
          <p className="mt-2 text-sm text-slate-400">
            Add appointment times that users can book.
          </p>

          <form onSubmit={handleCreateSlot} className="mt-6 space-y-5">
            <div>
              <label className="text-sm text-slate-300">Service name</label>
              <input
                name="serviceName"
                value={formData.serviceName}
                onChange={handleChange}
                placeholder="Career mentorship session"
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-sm text-slate-300">Start time</label>
              <input
                name="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-sm text-slate-300">End time</label>
              <input
                name="endTime"
                type="datetime-local"
                value={formData.endTime}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-indigo-500"
              />
            </div>

            <button
              disabled={creating}
              className="w-full rounded-xl bg-indigo-600 py-3 font-semibold hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-900"
            >
              {creating ? "Creating..." : "Create slot"}
            </button>
          </form>
        </section>

        <section>
          <div>
            <h2 className="text-2xl font-bold">All Slots</h2>
            <p className="mt-2 text-sm text-slate-400">
              Manage appointment availability.
            </p>
          </div>

          {loading ? (
            <LoadingState text="Loading slots..." />
          ) : slots.length === 0 ? (
            <EmptyState
              title="No slots yet"
              message="Create your first appointment slot."
            />
          ) : (
            <div className="mt-6 space-y-4">
              {slots.map((slot) => {
                const isBooked = slot.status === "booked";
                const isCancelled = slot.status === "cancelled";
                const working = actionId === slot._id;

                return (
                  <div
                    key={slot._id}
                    className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
                  >
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                      <div>
                        <h3 className="font-semibold">{slot.serviceName}</h3>
                        <p className="mt-2 text-sm text-slate-400">
                          {formatDateTime(slot.startTime)} -{" "}
                          {formatDateTime(slot.endTime)}
                        </p>
                      </div>

                      <span
                        className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                          slot.status === "available"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : slot.status === "booked"
                              ? "bg-indigo-500/10 text-indigo-400"
                              : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {slot.status}
                      </span>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        onClick={() =>
                          setConfirmAction({
                            type: "cancel",
                            id: slot._id,
                          })
                        }
                        disabled={isBooked || isCancelled || working}
                        className="rounded-xl border border-amber-500/30 px-4 py-2 text-sm font-semibold text-amber-400 hover:bg-amber-500/10 disabled:cursor-not-allowed disabled:border-slate-700 disabled:text-slate-500"
                      >
                        {working ? "Working..." : "Cancel"}
                      </button>

                      <button
                        onClick={() =>
                          setConfirmAction({
                            type: "delete",
                            id: slot._id,
                          })
                        }
                        disabled={isBooked || working}
                        className="rounded-xl border border-red-500/30 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:border-slate-700 disabled:text-slate-500"
                      >
                        {working ? "Working..." : "Delete"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
      <ConfirmModal
        open={Boolean(confirmAction)}
        title={
          confirmAction?.type === "delete" ? "Delete slot?" : "Cancel slot?"
        }
        message={
          confirmAction?.type === "delete"
            ? "This will permanently remove the slot."
            : "This will mark the slot as cancelled."
        }
        confirmText={
          confirmAction?.type === "delete" ? "Delete slot" : "Cancel slot"
        }
        loading={Boolean(actionId)}
        onClose={() => setConfirmAction(null)}
        onConfirm={async () => {
          if (confirmAction?.type === "delete") {
            await handleDeleteSlot(confirmAction.id);
          } else {
            await handleCancelSlot(confirmAction.id);
          }

          setConfirmAction(null);
        }}
      />
    </AppLayout>
  );
}
