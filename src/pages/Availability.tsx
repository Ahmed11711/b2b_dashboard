import React, { useEffect, useState } from "react";
import {
  Clock,
  Save,
  Plus,
  Trash2,
  Calendar,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { Button } from "../components/Button";
import { serviceApi } from "../services/serviceApi";
import { Availability, Service } from "../types";
import { toast, Toaster } from "sonner";
import { cn } from "../lib/utils";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// خريطة لتحويل النصوص القادمة من الباك أند إلى أرقام
const DAY_MAP: { [key: string]: number } = {
  SUN: 0,
  MON: 1,
  TUES: 2,
  WEDNES: 3,
  THURS: 4,
  FRI: 5,
  SATUR: 6,
};

const AvailabilityPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    null,
  );
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      const [servicesRes, availabilityRes] = await Promise.all([
        serviceApi.getServices(),
        serviceApi.getAvailability(),
      ]);

      // 1. معالجة الخدمات
      const fetchedServices = servicesRes.data || [];

      // 2. معالجة المواعيد وتحويل الـ day_of_week من نص إلى رقم إذا لزم الأمر
      const fetchedAvailability = (availabilityRes.data || []).map(
        (slot: any) => ({
          ...slot,
          // تحويل "SUN" -> 0 أو "09:00:00" -> "09:00"
          day_of_week:
            typeof slot.day_of_week === "string"
              ? DAY_MAP[slot.day_of_week]
              : slot.day_of_week,
          start_time: slot.start_time.slice(0, 5),
          end_time: slot.end_time.slice(0, 5),
        }),
      );

      setServices(fetchedServices);
      setAvailability(fetchedAvailability);

      if (fetchedServices.length > 0 && selectedServiceId === null) {
        setSelectedServiceId(fetchedServices[0].id);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to fetch data from server");
    } finally {
      setIsLoading(false);
    }
  };

  // تصفية المواعيد بناءً على الخدمة المختارة حالياً
  const currentServiceAvailability = availability.filter(
    (a) => Number(a.service_id) === Number(selectedServiceId),
  );

  const handleAddSlot = (dayIndex: number) => {
    if (!selectedServiceId) return;

    const newSlot: Availability = {
      id: Date.now(), // ID مؤقت للفرونت اند
      service_id: selectedServiceId,
      day_of_week: dayIndex,
      start_time: "09:00",
      end_time: "17:00",
      is_available: true,
    };

    setAvailability([...availability, newSlot]);
    toast.success(`New slot added for ${DAYS[dayIndex]}`);
  };

  const handleRemoveSlot = (id: number) => {
    setAvailability(availability.filter((a) => a.id !== id));
    toast.info("Time slot removed");
  };

  const handleUpdateSlot = (id: number, updates: Partial<Availability>) => {
    setAvailability(
      availability.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    );
  };

  const handleSave = async () => {
    if (!selectedServiceId) return;

    setIsSaving(true);
    try {
      // نأخذ فقط المواعيد الخاصة بالخدمة الحالية
      const payload = availability.filter(
        (a) => Number(a.service_id) === Number(selectedServiceId),
      );

      // نرسلها للباك أند
      // الباك أند بيمسح كل القديم للخدمة دي ويحط الـ payload الجديد
      await serviceApi.updateAvailability(selectedServiceId, {
        slots: payload,
      });

      toast.success("Changes saved to database");
      await fetchInitialData(); // تحديث لجلب الـ IDs الجديدة
    } catch (error) {
      toast.error("Failed to sync with server");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading)
    return (
      <div className="animate-pulse space-y-8 p-6">
        <div className="h-12 w-1/3 bg-slate-100 border border-border-thin rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="h-64 bg-slate-100 border border-border-thin rounded-2xl" />
          <div className="lg:col-span-3 h-96 bg-slate-100 border border-border-thin rounded-2xl" />
        </div>
      </div>
    );

  return (
    <div className="space-y-10 p-6">
      <Toaster position="top-right" richColors />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-carbon-black">
            Service Availability
          </h1>
          <p className="text-text-description mt-1 text-sm">
            Manage custom working hours for each service.
          </p>
        </div>
        <Button
          onClick={handleSave}
          isLoading={isSaving}
          className="btn-emerald h-10 text-xs px-6"
        >
          <Save className="mr-2 h-4 w-4" /> Save All Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-xl border border-border-light bg-white p-4 shadow-sm">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">
              Select Service
            </h3>
            <div className="space-y-1">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setSelectedServiceId(service.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-semibold transition-all",
                    selectedServiceId === service.id
                      ? "bg-emerald-50 text-emerald-700 border-l-2 border-emerald-600"
                      : "text-slate-500 hover:bg-slate-50 hover:text-carbon-black",
                  )}
                >
                  <span className="truncate">{service.service_name}</span>
                  {selectedServiceId === service.id && (
                    <ChevronRight className="h-3.5 w-3.5" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="lg:col-span-3 space-y-6">
          {DAYS.map((dayName, dayIndex) => {
            const daySlots = currentServiceAvailability.filter(
              (s) => s.day_of_week === dayIndex,
            );

            return (
              <div
                key={dayName}
                className="rounded-xl border border-border-light bg-white shadow-sm overflow-hidden"
              >
                <div className="flex items-center justify-between px-6 py-3.5 bg-slate-50/50 border-b border-border-light">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-semibold text-carbon-black">
                      {dayName}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white border border-border-light text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      {daySlots.length}{" "}
                      {daySlots.length === 1 ? "Slot" : "Slots"}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddSlot(dayIndex)}
                    className="h-8 text-[10px] font-semibold border-slate-200"
                  >
                    <Plus className="mr-1 h-3 w-3" /> Add Slot
                  </Button>
                </div>

                <div className="p-6">
                  {daySlots.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-slate-300">
                      <Clock className="h-6 w-6 mb-2 opacity-20" />
                      <p className="text-xs italic">
                        No availability set for this day
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {daySlots.map((slot) => (
                        <div
                          key={slot.id}
                          className={cn(
                            "group flex flex-col sm:flex-row sm:items-center gap-6 p-4 rounded-lg border transition-all",
                            slot.is_available
                              ? "bg-white border-border-light"
                              : "bg-slate-50 opacity-60",
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase w-8">
                                From
                              </span>
                              <input
                                type="time"
                                value={slot.start_time}
                                onChange={(e) =>
                                  handleUpdateSlot(slot.id, {
                                    start_time: e.target.value,
                                  })
                                }
                                className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase w-8">
                                To
                              </span>
                              <input
                                type="time"
                                value={slot.end_time}
                                onChange={(e) =>
                                  handleUpdateSlot(slot.id, {
                                    end_time: e.target.value,
                                  })
                                }
                                className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-4 ml-auto">
                            <button
                              onClick={() =>
                                handleUpdateSlot(slot.id, {
                                  is_available: !slot.is_available,
                                })
                              }
                              className={cn(
                                "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                                slot.is_available
                                  ? "bg-emerald-500"
                                  : "bg-slate-200",
                              )}
                            >
                              <span
                                className={cn(
                                  "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform",
                                  slot.is_available
                                    ? "translate-x-4.5"
                                    : "translate-x-1",
                                )}
                              />
                            </button>
                            <button
                              onClick={() => handleRemoveSlot(slot.id)}
                              className="p-2 text-slate-300 hover:text-rose-500"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AvailabilityPage;
