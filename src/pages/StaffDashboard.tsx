import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  Navigation,
  MapPin,
  CheckCircle2,
  Clock,
  Loader2,
  User,
  ListTodo,
  CheckSquare,
  Wallet,
  Calendar,
  Banknote,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import { staffService } from "../services/staffServiceDashboard";
import { StaffBooking, BookingStatus } from "../types";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { Modal } from "../components/Modal";
import { toast, Toaster } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

const StaffDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<StaffBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeBookingId, setActiveBookingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [isCompleting, setIsCompleting] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const watchIdRef = useRef<number | null>(null);

  // إحصائيات سريعة
  const stats = useMemo(() => {
    const safeBookings = Array.isArray(bookings) ? bookings : [];
    return {
      total: safeBookings.length,
      completed: safeBookings.filter((b) => b.status === "completed").length,
      cashToCollect: safeBookings
        .filter(
          (b) =>
            (b.payment_status === "cash_on_hand" ||
              b.payment_status === "unpaid") &&
            b.status !== "completed",
        )
        .reduce((acc, curr) => acc + Number(curr.total_price || 0), 0),
    };
  }, [bookings]);

  useEffect(() => {
    fetchBookings();
    return () => {
      stopTimer();
      stopTracking();
    };
  }, []);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const response = await staffService.getMyBookings();
      if (response?.data) setBookings(response.data);
    } catch (error) {
      toast.error("Could not load assignments");
    } finally {
      setIsLoading(false);
    }
  };

  const startTracking = () => {
    if ("geolocation" in navigator) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (p) => staffService.sendLocation(p.coords.latitude, p.coords.longitude),
        () => toast.error("Please enable GPS"),
        { enableHighAccuracy: true },
      );
    }
  };

  const stopTracking = () =>
    watchIdRef.current && navigator.geolocation.clearWatch(watchIdRef.current);
  const startTimer = () => {
    setTimer(0);
    timerRef.current = setInterval(() => setTimer((p) => p + 1), 1000);
  };
  const stopTimer = () => timerRef.current && clearInterval(timerRef.current);

  const handleUpdateStatus = async (id: number, newStatus: BookingStatus) => {
    try {
      await staffService.updateBookingStatus(id, newStatus);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b)),
      );
      if (newStatus === "on_the_way") startTracking();
      if (newStatus === "in_progress") {
        stopTracking();
        startTimer();
      }
      toast.success(`Status updated to ${newStatus.replace("_", " ")}`);
    } catch (e) {
      toast.error("Update failed");
    }
  };

  const handleCompleteOrder = async () => {
    if (!activeBookingId) return;
    setIsCompleting(true);
    try {
      await staffService.completeBooking(activeBookingId, { notes });
      setBookings((prev) =>
        prev.map((b) =>
          b.id === activeBookingId ? { ...b, status: "completed" } : b,
        ),
      );
      toast.success("Job marked as finished");
      setIsModalOpen(false);
      setNotes("");
      stopTimer();
    } catch (e) {
      toast.error("Failed to complete job");
    } finally {
      setIsCompleting(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50/50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="mt-4 text-sm font-medium text-slate-500">
          Loading schedule...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10">
      <Toaster position="bottom-center" />

      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-4">
        <div className="mx-auto max-w-3xl flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Work Console</h1>
            <p className="text-xs text-slate-500 font-medium">
              Manage your daily tasks
            </p>
          </div>
          <Button
            onClick={fetchBookings}
            variant="ghost"
            className="text-blue-600 hover:bg-blue-50 text-xs font-bold"
          >
            REFRESH
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 pt-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <StatBox
            label="Total Tasks"
            value={stats.total}
            icon={<ListTodo size={16} />}
            color="blue"
          />
          <StatBox
            label="Finished"
            value={stats.completed}
            icon={<CheckSquare size={16} />}
            color="emerald"
          />
          <StatBox
            label="Cash"
            value={`${stats.cashToCollect}`}
            icon={<Wallet size={16} />}
            color="rose"
          />
        </div>

        {/* Task List */}
        <div className="space-y-6">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
            Ongoing Schedule
          </h2>

          <AnimatePresence mode="popLayout">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group relative bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  {/* Status Indicator Bar */}
                  <div
                    className={cn(
                      "absolute left-0 top-0 bottom-0 w-1.5",
                      booking.status === "in_progress"
                        ? "bg-amber-400"
                        : booking.status === "completed"
                          ? "bg-emerald-400"
                          : "bg-slate-200",
                    )}
                  />

                  <div className="p-6">
                    {/* Row 1: ID & Status */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-100 p-2 rounded-xl text-slate-600">
                          <User size={18} />
                        </div>
                        <span className="font-bold text-slate-900">
                          Task #{booking.id}
                        </span>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-slate-50 text-slate-600 border-none px-3 py-1 text-[10px] font-bold"
                      >
                        {booking.status.replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>

                    {/* Row 2: Location */}
                    <div className="flex items-start gap-2 mb-6">
                      <MapPin size={16} className="text-slate-400 mt-0.5" />
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">
                        {booking.address}
                      </p>
                    </div>

                    {/* Row 3: Time Info */}
                    <div className="flex gap-4 mb-6">
                      <div className="bg-slate-50 rounded-2xl p-3 flex-1 border border-slate-100/50">
                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1 flex items-center gap-1">
                          <Clock size={12} /> Start
                        </p>
                        <p className="text-sm font-bold text-slate-700">
                          {booking.start_time}
                        </p>
                      </div>
                      <div className="bg-slate-50 rounded-2xl p-3 flex-1 border border-slate-100/50">
                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1 flex items-center gap-1">
                          <Calendar size={12} /> End
                        </p>
                        <p className="text-sm font-bold text-slate-700">
                          {booking.end_time}
                        </p>
                      </div>
                    </div>

                    {/* Cash Notice (If applicable) */}
                    {(booking.payment_status === "cash_on_hand" ||
                      booking.payment_status === "unpaid") &&
                      booking.status !== "completed" && (
                        <div className="mb-6 flex items-center justify-between bg-rose-50/50 border border-rose-100 px-4 py-3 rounded-2xl">
                          <div className="flex items-center gap-2 text-rose-600">
                            <Banknote size={18} />
                            <span className="text-xs font-bold uppercase tracking-tight">
                              Collect Cash
                            </span>
                          </div>
                          <span className="text-sm font-black text-rose-600">
                            {booking.total_price} EGP
                          </span>
                        </div>
                      )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                      {booking.status === "confirmed" && (
                        <Button
                          onClick={() =>
                            handleUpdateStatus(booking.id, "on_the_way")
                          }
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-12 font-bold transition-transform active:scale-95"
                        >
                          Start Trip
                        </Button>
                      )}

                      {booking.status === "on_the_way" && (
                        <Button
                          onClick={() =>
                            handleUpdateStatus(booking.id, "in_progress")
                          }
                          className="w-full bg-slate-900 hover:bg-black text-white rounded-2xl h-12 font-bold"
                        >
                          I've Arrived
                        </Button>
                      )}

                      {booking.status === "in_progress" && (
                        <div className="flex w-full gap-3">
                          <div className="flex items-center px-4 bg-amber-50 text-amber-700 rounded-2xl font-mono font-bold text-sm">
                            {Math.floor(timer / 60)}:
                            {(timer % 60).toString().padStart(2, "0")}
                          </div>
                          <Button
                            onClick={() => {
                              setActiveBookingId(booking.id);
                              setIsModalOpen(true);
                            }}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-12 font-bold"
                          >
                            Finish Mission
                          </Button>
                        </div>
                      )}

                      {booking.status === "completed" && (
                        <div className="w-full h-12 flex items-center justify-center gap-2 text-emerald-600 font-bold bg-emerald-50 rounded-2xl">
                          <CheckCircle2 size={18} /> Done
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-medium">
                  No tasks assigned for today.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Simplified Completion Modal (Notes Only) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !isCompleting && setIsModalOpen(false)}
        title="Finalize Mission"
      >
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <MessageSquare size={18} />
            <span className="text-sm font-bold uppercase tracking-tight">
              Post-Job Notes
            </span>
          </div>

          <textarea
            className="w-full h-40 rounded-2xl border border-slate-200 p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all resize-none"
            placeholder="Write a brief summary of what was done or any issues encountered..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <div className="flex gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 h-12 rounded-xl text-slate-400 font-bold"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCompleteOrder}
              disabled={isCompleting || !notes.trim()}
              className="flex-1 h-12 rounded-xl bg-blue-600 text-white font-bold disabled:bg-slate-100 disabled:text-slate-400"
            >
              {isCompleting ? (
                <Loader2 className="h-5 w-5 animate-spin mx-auto" />
              ) : (
                "Submit & Close"
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// UI Helper Components
const StatBox = ({ label, value, icon, color }: any) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    rose: "bg-rose-50 text-rose-600",
  };
  return (
    <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center">
      <div
        className={cn(
          "h-8 w-8 rounded-full flex items-center justify-center mb-2",
          colors[color as keyof typeof colors],
        )}
      >
        {icon}
      </div>
      <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">
        {label}
      </span>
      <span className="text-sm font-black text-slate-900">{value}</span>
    </div>
  );
};

export default StaffDashboard;
