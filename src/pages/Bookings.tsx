import React, { useEffect, useState, useMemo } from "react";
import {
  Search,
  Plus,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  Clock,
  Briefcase,
  Loader2,
  Phone,
  Mail,
  Tag,
  DollarSign,
  Wallet,
} from "lucide-react";
import { DataTable } from "../components/DataTable";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Badge } from "../components/Badge";
import { bookingApi } from "../services/bookingApi";
import { Booking } from "../types";
import { formatCurrency } from "../lib/utils";
import { toast, Toaster } from "sonner";

interface Staff {
  id: number;
  name: string;
}

const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [staffMembers, setStaffMembers] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // حالات الفلترة والبحث
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // حالات المودالات
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(
    null,
  );
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const [bookingsRes, staffRes] = await Promise.all([
        bookingApi.getBookings(),
        bookingApi.getStaff(),
      ]);
      setBookings(bookingsRes.data || []);
      setStaffMembers(staffRes.data || []);
    } catch (error) {
      toast.error("Failed to sync data with server");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * تفعيل الفلترة والبحث من الفرونت أند (Client-side Filtering)
   * نستخدم useMemo للأداء العالي
   */
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      // منطق البحث (بالاسم، الإيميل، أو معرف الحجز)
      const searchContent =
        `${booking.user?.name} ${booking.user_name} ${booking.id} ${booking.service?.service_name}`.toLowerCase();
      const matchesSearch = searchContent.includes(searchQuery.toLowerCase());

      // منطق فلترة الحالة
      const matchesStatus =
        statusFilter === "all" || booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchQuery, statusFilter]);

  const handleOpenStaffModal = (bookingId: number) => {
    setSelectedBookingId(bookingId);
    setIsStaffModalOpen(true);
  };

  const handleOpenUserModal = (user: any) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedStaffId || !selectedBookingId)
      return toast.error("Please select a staff member");
    setIsUpdatingStatus(true);
    try {
      await bookingApi.updateBookingStatus(selectedBookingId, "confirmed", {
        staff_id: selectedStaffId,
      });
      toast.success("Staff assigned successfully!");
      setIsStaffModalOpen(false);
      fetchInitialData();
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const columns = [
    {
      header: "Customer",
      accessor: (b: any) => (
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => handleOpenUserModal(b.user)}
        >
          <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
            <User size={18} />
          </div>
          <div>
            <div className="font-semibold text-slate-900 group-hover:underline">
              {b.user?.name || b.user_name}
            </div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">
              ID: #{b.id}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Service & Staff",
      accessor: (b: any) => (
        <div className="space-y-1">
          <Badge variant="outline" className="text-slate-700 border-slate-200">
            {b.service?.service_name}
          </Badge>
          {b.staff && (
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
              <Briefcase size={12} /> {b.staff.name}
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Pricing & Payment",
      accessor: (b: any) => {
        // تحديد الشكل بناءً على القيمة الجديدة
        const paymentConfigs: Record<string, { label: string; variant: any }> =
          {
            paid: { label: "Paid", variant: "success" },
            unpaid: { label: "Unpaid", variant: "error" },
            cash_on_hand: { label: "Cash on Hand", variant: "warning" }, // لون برتقالي/أصفر
          };

        const config = paymentConfigs[b.payment_status] || {
          label: b.payment_status,
          variant: "outline",
        };

        return (
          <div className="space-y-1.5">
            <div className="flex flex-col">
              <span className="font-bold text-slate-900">
                {formatCurrency(b.total_price)}
              </span>
              {b.discount_applied > 0 && (
                <span className="text-[10px] text-rose-500 font-medium">
                  -{b.discount_applied}% Off
                </span>
              )}
            </div>

            {/* العرض الاحترافي للحالة */}
            <Badge
              variant={config.variant}
              className="text-[9px] px-1.5 py-0 h-4 uppercase font-bold"
            >
              {config.label}
            </Badge>
          </div>
        );
      },
    },
    {
      header: "Status",
      accessor: (b: any) => (
        <Badge
          variant={
            b.status === "confirmed"
              ? "success"
              : b.status === "pending"
                ? "warning"
                : b.status === "completed"
                  ? "info"
                  : "error"
          }
        >
          {b.status}
        </Badge>
      ),
    },
    {
      header: "Notes",
      accessor: (b: any) => (
        <div
          className="max-w-[100px] truncate text-[11px] text-slate-400 italic"
          title={b.notes}
        >
          {b.notes || "---"}
        </div>
      ),
    },
    {
      header: "Actions",
      accessor: (b: any) => (
        <div className="flex items-center gap-2">
          {b.status === "pending" && (
            <Button
              size="sm"
              variant="ghost"
              className="text-emerald-600 h-8 w-8 p-0 border border-emerald-100"
              onClick={() => handleOpenStaffModal(b.id)}
            >
              <CheckCircle size={16} />
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="text-slate-300 h-8 w-8 p-0 hover:text-rose-500"
          >
            <XCircle size={16} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <Toaster position="top-right" richColors />

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">
          Booking Management
        </h2>
        <div className="text-sm text-slate-500">
          Showing {filteredBookings.length} results
        </div>
      </div>

      {/* Filters Bar - يعمل بالكامل من الفرونت */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by name, ID, or service..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="border rounded-lg px-3 text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500/20"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* نمرر filteredBookings بدلاً من bookings الأصلية */}
        <DataTable
          columns={columns}
          data={filteredBookings}
          isLoading={isLoading}
        />
      </div>

      {/* المودالات (Assign Staff & User Profile) تبقى كما هي مع التأكد من عرض حالة الدفع */}
      {/* ... كود المودالات السابق ... */}

      {/* MODAL: Customer Profile (مع إضافة أيقونة الحالة) */}
      {isUserModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in duration-200">
            <div className="bg-slate-900 p-6 text-center text-white relative">
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-white"
              >
                <XCircle size={20} />
              </button>
              <div className="w-20 h-20 bg-emerald-500 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold border-4 border-slate-800 shadow-lg">
                {selectedUser.name.charAt(0)}
              </div>
              <h4 className="text-xl font-bold">{selectedUser.name}</h4>
              <p className="text-xs text-slate-400">{selectedUser.email}</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center text-emerald-600 shadow-sm">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Mobile Number
                  </p>
                  <p className="text-sm font-semibold">
                    {selectedUser.phone || "Not Provided"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center text-emerald-600 shadow-sm">
                  <Wallet size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Account Status
                  </p>
                  <p className="text-sm font-semibold">
                    {selectedUser.is_active ? "Active Member" : "Inactive"}
                  </p>
                </div>
              </div>
              <Button
                className="w-full h-11 btn-emerald"
                onClick={() => setIsUserModalOpen(false)}
              >
                Close Profile
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
