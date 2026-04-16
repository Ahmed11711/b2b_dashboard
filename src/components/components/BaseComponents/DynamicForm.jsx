import React, { useState, useEffect } from "react"; // ضفنا useEffect
import FormFieldRendererLayout from "./FormFieldRendererLayout";

// ضفنا initialData و mode في الـ Props
export default function DynamicForm({ fields, onSubmit, title, initialData, mode }) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // 🛠️ أهم جزء للـ Edit: تحديث الـ formData لما الـ initialData توصل
useEffect(() => {
  if (initialData) {
    setFormData(initialData);
  } else {
    // ✅ لو Create، حدد قيم افتراضية من الـ fields
    const defaults = {};
    fields.forEach(f => {
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
    // التحكم في المساحة: max-w-4xl يخلي الفورم في النص بشكل احترافي
  <div className="max-w-4xl mx-auto py-8 px-4">
  <form onSubmit={handleSubmit} className="space-y-10">
    {title && (
      <div className="mb-10">
        <h2 className="text-4xl font-black text-carbon-black tracking-tight">
          {title}
        </h2>

        <div className="h-1.5 w-20 bg-emerald-solid rounded-full mt-4"></div>
      </div>
    )}

        {/* تقسيم الحقول بشكل متوازن */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
          {fields.map((field) => (
            <FormFieldRendererLayout
              key={field.key}
              field={field}
              value={formData[field.key]}
              error={errors[field.key]}
              onChange={handleChange}
              disabled={loading}
            />
          ))}
        </div>

        {/* زرار الأكشن */}
      <div className="flex justify-end pt-10 border-t border-border-light mt-12">
  <button
    type="submit"
    disabled={loading}
    className="
      w-full md:w-auto px-16 py-5 
      bg-emerald-solid text-white 
      rounded-[2rem] font-black text-xl 
      shadow-lg 
      hover:bg-primary-deep hover:-translate-y-1 
      transition-all active:scale-95 
      disabled:opacity-50
    "
  >
    {loading ? "Saving Changes..." : mode === "edit" ? "Update Record" : "Create Record"}
  </button>
</div>
      </form>
    </div>
  );
}