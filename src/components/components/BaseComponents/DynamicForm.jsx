import React, { useState, useEffect } from "react"; // ضفنا useEffect
import FormFieldRendererLayout from "./FormFieldRendererLayout";
import { useTranslation } from "../../../hooks/useTranslation";

export default function DynamicForm({
  fields,
  onSubmit,
  title,
  initialData,
  mode,
}) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      const defaults = {};
      fields.forEach((f) => {
        if (f.type === "checkbox" || f.type === "boolean") {
          defaults[f.key] = 0; // ← افتراضي = 0 (Inactive)
        }
      });
      setFormData(defaults);
    }
  }, [initialData]);
  if (!fields || fields.length === 0) {
    return (
      <div className="p-10 text-center border-2 border-dashed rounded-3xl text-slate-400">
        No fields available to render.
      </div>
    );
  }

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // بنبعت الـ formData كاملة للـ onSubmit
    const result = await onSubmit(formData);
    if (result && !result.success && result.errors) {
      setErrors(result.errors);
    }
    setLoading(false);
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 animate-in fade-in duration-500"
      >
        <div className="bg-card-bg rounded-2xl shadow-sm border border-border-light overflow-hidden">
          <div className="px-6 py-5 border-b border-border-light bg-card-bg">
            <h3 className="text-lg font-bold text-heading-slate capitalize">
              {t("Basic Information")} {/* ← غير */}
            </h3>
          </div>
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {fields.map((field) => (
                <FormFieldRendererLayout
                  key={field.key}
                  field={{ ...field, label: t(field.label) }} // ← ترجمة الـ label
                  value={formData[field.key]}
                  error={errors[field.key]}
                  onChange={handleChange}
                  disabled={loading}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="btn-emerald min-w-[160px] relative overflow-hidden rounded-full py-2.5 px-6 font-semibold"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                {t("Processing...")} {/* ← غير */}
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                {mode === "edit" ? t("Publish") : t("Create")} {/* ← غير */}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
