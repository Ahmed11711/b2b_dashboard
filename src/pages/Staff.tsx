import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  User,
  Phone,
  Mail,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { DataTable } from "../components/DataTable";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Modal } from "../components/Modal";
import { staffApi } from "../services/staffApi";
import { Staff } from "../types";
import { toast, Toaster } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";

const StaffPage: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"list" | "tracking">("list");

  // جلب البيانات عند فتح الصفحة
  useEffect(() => {
    fetchData();
  }, []);

  // دالة لتوحيد شكل البيانات (Normalization)
  // عشان لو الباك أند بعت name نحوله لـ full_name والعكس
  const normalizeStaffData = (data: any): Staff => {
    return {
      ...data,
      full_name: data.full_name || data.name || "N/A", // حل مشكلة اختفاء الاسم
    };
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await staffApi.getStaff();
      const rawData = res.data || res;

      // توحيد البيانات لكل المصفوفة
      const normalizedData = Array.isArray(rawData)
        ? rawData.map(normalizeStaffData)
        : [];

      setStaff(normalizedData);
    } catch (error: any) {
      toast.error("Could not load staff list");
    } finally {
      setIsLoading(false);
    }
  };

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(password);
    toast.success("Password generated");
  };

  const handleSaveStaff = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);
    const staffData: any = {
      full_name: formData.get("full_name"), // القيمة من Input
      name: formData.get("full_name"), // لضمان التوافق مع الباك أند لو بيطلب name
      phone: formData.get("phone"),
      email: formData.get("email"),
    };

    const password = formData.get("password") as string;
    if (password) staffData.password = password;

    try {
      if (editingStaff) {
        const res = await staffApi.updateStaff(editingStaff.id, staffData);
        const updated = normalizeStaffData(res.data || res);
        setStaff(staff.map((s) => (s.id === editingStaff.id ? updated : s)));
        toast.success("Staff member updated successfully");
      } else {
        const res = await staffApi.createStaff(staffData);
        const newlyCreated = normalizeStaffData(res.data || res);
        setStaff((prev) => [newlyCreated, ...prev]); // إضافة في بداية القائمة
        toast.success("Staff member added successfully");
      }
      setIsModalOpen(false);
      setGeneratedPassword("");
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to save staff";
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      try {
        await staffApi.deleteStaff(id);
        setStaff(staff.filter((s) => s.id !== id));
        toast.success("Staff member deleted");
      } catch (error) {
        toast.error("Failed to delete");
      }
    }
  };

  // تعديل الفلتر ليكون مرن مع الحقول
  const filteredStaff = staff.filter((s) => {
    const search = searchQuery.toLowerCase();
    const name = (s.full_name || "").toLowerCase();
    const email = (s.email || "").toLowerCase();
    return name.includes(search) || email.includes(search);
  });

  const columns = [
    {
      header: "Staff Member",
      accessor: (s: Staff) => (
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-border-thin">
            <User className="h-5 w-5 text-carbon-black" />
          </div>
          <div>
            <div className="font-bold text-carbon-black text-sm">
              {s.full_name}
            </div>
            <div className="text-[11px] text-cool-gray">{s.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      accessor: (s: Staff) => (
        <span className="text-xs font-medium text-cool-gray">{s.role}</span>
      ),
    },
    {
      header: "Actions",
      accessor: (s: Staff) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditingStaff(s);
              setGeneratedPassword("");
              setIsModalOpen(true);
            }}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(s.id)}
            className="text-rose-500 hover:bg-rose-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      className: "text-right",
    },
  ];

  return (
    <div className="space-y-8">
      <Toaster position="top-right" richColors />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-carbon-black">
            Staff Management
          </h1>
          <p className="text-sm text-text-description">
            Manage your company service providers.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-bg-surface p-1 rounded-lg border border-border-light">
            <button
              onClick={() => setActiveTab("list")}
              className={cn(
                "px-4 py-1.5 rounded-md text-xs font-semibold transition-all",
                activeTab === "list"
                  ? "bg-white shadow-sm border border-border-light"
                  : "text-slate-400",
              )}
            >
              List View
            </button>
            <button
              onClick={() => setActiveTab("tracking")}
              className={cn(
                "px-4 py-1.5 rounded-md text-xs font-semibold transition-all",
                activeTab === "tracking"
                  ? "bg-white shadow-sm border border-border-light"
                  : "text-slate-400",
              )}
            >
              Live Tracking
            </button>
          </div>
          <Button
            onClick={() => {
              setEditingStaff(null);
              setGeneratedPassword("");
              setIsModalOpen(true);
            }}
            className="btn-emerald h-10 text-xs"
          >
            <Plus className="mr-2 h-4 w-4" /> Add New Staff
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "list" ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search by name or email..."
                className="pl-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DataTable
              columns={columns}
              data={filteredStaff}
              isLoading={isLoading}
            />
          </motion.div>
        ) : (
          <motion.div
            key="tracking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-[600px] bg-slate-50 rounded-2xl border flex items-center justify-center"
          >
            <p className="text-slate-400 text-sm italic">
              Map Tracking Interface Connected...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStaff ? "Edit Staff Member" : "Add New Staff"}
      >
        <form className="p-6 space-y-6" onSubmit={handleSaveStaff}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              name="full_name"
              defaultValue={editingStaff?.full_name}
              required
              icon={<User className="h-4 w-4" />}
            />
            {/* <Input
              label="Phone Number"
              name="phone"
              defaultValue={editingStaff?.phone}
              required
              icon={<Phone className="h-4 w-4" />}
            /> */}
          </div>
          <Input
            label="Email Address"
            name="email"
            type="email"
            defaultValue={editingStaff?.email}
            required
            icon={<Mail className="h-4 w-4" />}
          />

          <div className="space-y-2">
            <label className="text-xs font-semibold text-carbon-black">
              Account Password
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  name="password"
                  value={generatedPassword}
                  onChange={(e) => setGeneratedPassword(e.target.value)}
                  placeholder={
                    editingStaff
                      ? "Leave empty to keep current"
                      : "Enter or generate password"
                  }
                  className="pr-12"
                />
                <button
                  type="button"
                  onClick={generatePassword}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-100 rounded-md"
                >
                  <RefreshCw className="h-4 w-4 text-slate-400" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="btn-emerald min-w-[120px]"
            >
              {isSaving ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                "Save Staff"
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StaffPage;
