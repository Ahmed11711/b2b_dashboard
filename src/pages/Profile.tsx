import React, { useEffect, useState, useRef } from "react";
import { Camera, CheckCircle2, ShieldCheck, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { profileService } from "../services/profileService";
import { CompanyProfile } from "../types";
import { toast, Toaster } from "sonner";

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await profileService.getProfile();
      setProfile(data);
    } catch (error: any) {
      toast.error("Failed to fetch profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // معاينة الصورة فوراً
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isExisting = !!profile?.id;
    setIsUpdating(true);

    const formData = new FormData(e.currentTarget);

    // تجميع البيانات النصية
    const dataToSend = {
      name: formData.get("name") as string,
      hourly_rate: formData.get("hourly_rate") as string,
      address: formData.get("address") as string,
      description: formData.get("description") as string,
      free_delivery: formData.get("free_delivery") === "on" ? 1 : 0,
    };

    try {
      // إرسال البيانات والصورة (لو وجدت) في طلب واحد
      const data = await profileService.saveProfile(
        dataToSend,
        selectedFile,
        isExisting,
      );
      setProfile(data);
      setSelectedFile(null); // تفريغ الملف المختار بعد الحفظ
      toast.success(
        isExisting ? "Profile updated!" : "Profile created successfully!",
      );
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error("New passwords do not match");
      return;
    }

    setIsUpdating(true);
    try {
      await profileService.changePassword({
        current_password: passwords.current,
        new_password: passwords.new,
      });
      toast.success("Password updated successfully");
      setIsChangingPassword(false);
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading)
    return <div className="p-10 animate-pulse bg-slate-50 h-screen" />;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8 animate-in fade-in duration-500">
      <Toaster position="top-right" richColors />

      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-carbon-black tracking-tight">
          {t("pages.profile.title")}
        </h1>
        <p className="text-text-description mt-1">
          {t("pages.profile.manage_info")}
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Sidebar: Logo & Quick Stats */}
        <div className="lg:col-span-1 space-y-8">
          <div className="rounded-xl border border-border-light bg-white p-6 shadow-sm text-center">
            <div className="relative mx-auto h-32 w-32">
              <img
                src={
                  previewUrl ||
                  profile?.logo ||
                  "https://via.placeholder.com/150"
                }
                alt="Logo"
                className="h-full w-full rounded-xl object-cover border-4 border-bg-surface shadow-sm"
              />
              <input
                type="file"
                id="logo-upload"
                className="hidden"
                accept="image/*"
                onChange={handleLogoChange}
              />
              <label
                htmlFor="logo-upload"
                className="absolute -bottom-2 -right-2 rounded-full bg-white p-2 shadow-lg border border-border-light hover:bg-bg-surface cursor-pointer"
              >
                <Camera className="h-4 w-4" />
              </label>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold text-carbon-black flex items-center justify-center gap-2">
                {profile?.name || "Company Name"}
                {Number(profile?.is_verified) === 1 && (
                  <ShieldCheck className="h-5 w-5 text-emerald-solid" />
                )}
              </h3>
              <p className="text-xs text-text-description mt-1">
                {profile?.address}
              </p>
              <div className="mt-2 flex items-center justify-center gap-1">
                <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                <span className="text-xs font-bold text-carbon-black">
                  {profile?.rating || "0.0"}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border-light flex justify-around">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">
                  Hourly Rate
                </p>
                <p className="text-base font-semibold text-carbon-black">
                  ${profile?.hourly_rate || 0}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">
                  Status
                </p>
                <p className="text-base font-semibold text-emerald-text">
                  Active
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content: Form */}
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-xl border border-border-light bg-white p-8 shadow-sm">
            <h3 className="text-lg font-semibold text-carbon-black mb-8">
              Business Information
            </h3>
            <form className="space-y-8" onSubmit={handleUpdateProfile}>
              <div className="grid gap-8 sm:grid-cols-2">
                <Input
                  label="Company Name"
                  name="name"
                  defaultValue={profile?.name}
                  required
                />
                <Input
                  label="Hourly Rate ($)"
                  name="hourly_rate"
                  type="number"
                  defaultValue={profile?.hourly_rate}
                  required
                />
              </div>

              <Input
                label="Business Address"
                name="address"
                defaultValue={profile?.address}
                required
              />

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Business Description
                </label>
                <textarea
                  name="description"
                  defaultValue={profile?.description}
                  rows={4}
                  className="flex w-full rounded-lg border border-border-thin bg-white px-4 py-3 text-sm focus:border-emerald-solid outline-none transition-all"
                  placeholder="Describe your services..."
                />
              </div>

              <div className="flex items-center justify-between p-6 rounded-xl bg-bg-surface border border-border-light">
                <div>
                  <p className="text-sm font-semibold text-carbon-black">
                    Free Delivery
                  </p>
                  <p className="text-xs text-text-description mt-1">
                    Enable to offer free delivery.
                  </p>
                </div>
                <input
                  type="checkbox"
                  name="free_delivery"
                  defaultChecked={Number(profile?.free_delivery) === 1}
                  className="h-5 w-10 appearance-none rounded-full bg-slate-200 transition-colors checked:bg-emerald-solid relative cursor-pointer before:content-[''] before:absolute before:h-4 before:w-4 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-transform checked:before:translate-x-5"
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  className="btn-emerald h-11 px-8 text-xs"
                  isLoading={isUpdating}
                >
                  Save All Changes
                </Button>
              </div>
            </form>
          </div>

          {/* Security */}
        </div>
      </div>
    </div>
  );
};

export default Profile;
