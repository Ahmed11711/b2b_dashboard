import { useState, useEffect } from "react";
import { getAll } from "../../../service/services/apiService";
import MultiSelectField from "../../components/BaseComponents/MultiSelectField";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function FormFieldRendererLayout({ field, value, onChange, error, disabled }) {
  const [options, setOptions] = useState(Array.isArray(field?.options) ? field.options : []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isRelation = field?.type === "select" && !Array.isArray(field?.options);

    if (isRelation) {
      const fetchRelations = async () => {
        setLoading(true);
        try {
          const targetPath = field.endpoint || field.key.replace("_id", "s");
          const queryParams = field.relation_fields ? { fields: field.relation_fields } : {};

          const response = await getAll(targetPath, queryParams);
          const rawData = response.data || response;

          const labelKey = field.options?.label || "name";
          const valueKey = field.options?.value || "id";

          const formatted = Array.isArray(rawData)
            ? rawData.map(item => ({
                label: item[labelKey],
                value: item[valueKey],
              }))
            : [];

          setOptions(formatted);
        } catch (err) {
          console.error(`❌ Error fetching ${field.key}:`, err);
        } finally {
          setLoading(false);
        }
      };

      fetchRelations();
    }
  }, [field?.key]);

  if (!field) return null;

  // 👇 الجزء المضاف: تحديد العرض الكامل بناءً على الـ key أو الـ type
  const isFullWidth = 
    field.type === "textarea" || 
    field.key?.toLowerCase().includes("description") || 
    field.key?.toLowerCase().includes("desc");

  // 👇 الجزء المضاف: تنظيف القيمة من الـ 0 أو الـ null لو الحقل اختياري
  const displayValue = (value === null || value === undefined) ? "" : value;

  // ================= STYLES =================

 const baseInputStyle = `
w-full min-h-[56px] px-5 rounded-2xl border
bg-card-bg/80 backdrop-blur-sm
border-border-thin
focus:border-emerald-solid focus:ring-4 focus:ring-emerald-solid/10
outline-none font-semibold text-carbon-gray
placeholder:text-text-description
transition-all duration-300
shadow-sm hover:shadow-md
${error ? "border-red-300 bg-red-50/40 focus:ring-red-100" : ""}
`;
  const labelStyle = `
  text-[11px] font-extrabold text-text-description
  uppercase tracking-widest ml-1 mb-1.5
  `;

  // ================= INPUT RENDER =================

  const renderInput = () => {
    switch (field.type) {
      // ================= SELECT =================
      case "select":
        return (
          <div className="relative group">
            <select
              name={field.key}
              value={displayValue}
              disabled={disabled || loading}
              onChange={(e) => onChange(field.key, e.target.value)}
              className={`${baseInputStyle} appearance-none cursor-pointer pr-10 ${
                loading ? "animate-pulse" : ""
              }`}
            >
              <option value="">
                {loading ? "Fetching..." : field.placeholder || `Select ${field.label}`}
              </option>

              {options.map((opt, i) => (
                <option key={i} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-description group-focus-within:text-emerald-solid transition">
              ▼
            </div>
          </div>
        );

      // ================= TEXTAREA / RICH TEXT =================
      case "textarea":
      case "text":
        if (isFullWidth) {
          const modules = {
            toolbar: [
              [{ 'header': [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              [{ 'align': [] }],
              ['link'],
              ['clean']
            ],
          };

          return (
            <div className="bg-white rounded-2xl border border-border-light overflow-hidden transition-all duration-300 hover:shadow-md focus-within:border-emerald-solid focus-within:ring-4 focus-within:ring-emerald-solid/10">
              <ReactQuill
                theme="snow"
                value={displayValue}
                onChange={(content) => onChange(field.key, content)}
                readOnly={disabled}
                modules={modules}
                placeholder={field.placeholder || `Enter ${field.label}...`}
                className="quill-editor"
              />
            </div>
          );
        }
         break;

      // ================= CHECKBOX =================
      case "checkbox":
      case "boolean":
        return (
          <div className="flex items-center justify-between p-4 md:p-5 bg-slate-50 rounded-2xl border border-border-light hover:border-emerald-solid/20 transition-all duration-300 shadow-sm hover:shadow">
            <div className="flex flex-col">
              <span className="text-xs md:text-sm font-bold tracking-tight text-carbon-black capitalize">{field.label}</span>
              <span className={`text-[10px] md:text-xs font-bold uppercase mt-1 tracking-widest ${value ? "text-emerald-solid" : "text-slate-400"}`}>
                {value ? "Enabled / Active" : "Disabled / Inactive"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => !disabled && onChange(field.key, value ? 0 : 1)}
              className={`relative inline-flex h-8 w-14 md:h-9 md:w-16 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-solid/20 shadow-inner ${value ? "bg-emerald-solid" : "bg-slate-300"}`}
            >
              <span className={`inline-block h-6 w-6 md:h-7 md:w-7 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${value ? "translate-x-7 md:translate-x-8" : "translate-x-1"}`} />
            </button>
          </div>
        );
      // ================= FILE =================
      case "file":
        return (
          <div className="flex flex-col gap-4">
            <div className="relative group border-2 border-dashed border-border-thin rounded-2xl p-6 text-center hover:border-emerald-solid transition-all cursor-pointer">
              <input
                type="file"
                onChange={(e) => onChange(field.key, e.target.files[0])}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />

              <div className="flex flex-col items-center gap-3">
                <div className="text-3xl text-emerald-solid group-hover:scale-110 transition">
                  ⬆
                </div>

                <p className="text-slate-500 font-medium">
                  {value ? "Click to change file" : "Click or drag to upload"}
                </p>
              </div>
            </div>

            {value && (
              <div className="relative w-36 h-36 group">
                <img
                  src={value instanceof File ? URL.createObjectURL(value) : value}
                  className="w-full h-full object-cover rounded-2xl border shadow-lg"
                  alt="preview"
                />

                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition rounded-2xl flex items-center justify-center">
                  <span className="text-white text-xs font-bold">Preview</span>
                </div>
              </div>
            )}
          </div>
        );
    
case "multi-select":
  return (
    <MultiSelectField
      field={field}
      value={value}
      onChange={onChange}
      error={error}
    />
  );
    }
    // ================= DEFAULT (للحالات العادية) =================
    return (
      <div className="relative group">
        <input
          type={field.type || "text"}
          name={field.key}
          value={displayValue}
          placeholder={field.placeholder}
          disabled={disabled}
          onChange={(e) => onChange(field.key, e.target.value)}
          className={`${baseInputStyle} pl-12`}
        />

        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-description group-focus-within:text-emerald-solid transition">
  ✎
</div>
      </div>
    );
  };

  return (
    // 👇 استخدام isFullWidth عشان يفرش الحقل في الـ Grid لو هو وصف
    <div className={`flex flex-col gap-1.5 animate-in fade-in slide-in-from-bottom-1 duration-500 ${isFullWidth ? "md:col-span-2" : ""} ${field.type === 'multi-select' ? 'relative z-10 focus-within:z-20' : ''}`}>
      {field.type !== "checkbox" && field.type !== "boolean" && field.type !== "multi-select" && (
        <label className={labelStyle}>
          {field.label}
          {field.required ? (
            <span className="text-red-400 text-lg ml-1">*</span>
          ) : (
            <span className="text-slate-400 normal-case font-medium ml-2">(Optional)</span>
          )}
        </label>
      )}

      {renderInput()}

      {error && (
        <p className="text-red-500 text-xs font-bold ml-2 flex items-center gap-1 mt-1">
          ⚠ {Array.isArray(error) ? error[0] : error}
        </p>
      )}
    </div>
  );
}