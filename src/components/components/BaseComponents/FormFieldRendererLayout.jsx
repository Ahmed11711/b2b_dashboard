import { useState, useEffect, useMemo } from "react";
import { getAll } from "../../../service/services/apiService";
import MultiSelectField from "../../components/BaseComponents/MultiSelectField";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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
    field.type === "rich-text" ||
    field.key?.toLowerCase().includes("description") || 
    field.key?.toLowerCase().includes("desc");

  // 👇 الجزء المضاف: تنظيف القيمة من الـ 0 أو الـ null لو الحقل اختياري
  const displayValue = (value === null || value === undefined) ? "" : value;

  // ================= STYLES =================

  // 👇 الجزء المضاف: الكشف عن اللغة العربية
  const isArabic = useMemo(() => {
    return field.is_arabic || 
           field.key?.toLowerCase().includes("arabic") || 
           field.label?.toLowerCase().includes("arabic") ||
           field.placeholder?.includes("عربي") ||
           field.label?.includes("عربي");
  }, [field]);

 const baseInputStyle = `
w-full h-14 px-5 rounded-2xl border
bg-card-bg/80 backdrop-blur-sm
border-border-thin
focus:border-emerald-solid focus:ring-4 focus:ring-emerald-solid/10
outline-none font-semibold text-carbon-gray
placeholder:text-text-description
transition-all duration-300
shadow-sm hover:shadow-md
${isArabic ? "text-right" : "text-left"}
${error ? "border-red-300 bg-red-50/40 focus:ring-red-100" : ""}
`;
  const labelStyle = `
  text-[11px] font-extrabold text-text-description
  uppercase tracking-widest ml-1 mb-1
  ${isArabic ? "text-right mr-1" : "text-left ml-1"}
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

            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-description group-focus-within:text-emerald-solid transition">
              ▼
            </div>
          </div>
        );

      // ================= TEXTAREA & SMART DESCRIPTION =================
      case "textarea":
      case "text":
        // لو الحقل وصف (Description) حتى لو نوعه text، هنخليه textarea وياخد صف لوحده
        if (isFullWidth || field.type === "textarea") {
          return (
            <textarea
              name={field.key}
              value={displayValue}
              disabled={disabled}
              dir={isArabic ? "rtl" : "ltr"}
              placeholder={field.placeholder}
              onChange={(e) => onChange(field.key, e.target.value)}
              className={`${baseInputStyle} h-32 py-4 resize-none`}
            />
          );
        }
         break;

      // ================= RICH TEXT (QUILL) =================
      case "rich-text":
        return (
          <div className={`quill-wrapper ${isArabic ? 'rtl' : ''}`}>
            <ReactQuill
              theme="snow"
              value={displayValue}
              onChange={(val) => onChange(field.key, val)}
              placeholder={field.placeholder || `Enter ${field.label}...`}
              className={`bg-white rounded-2xl overflow-hidden border border-border-thin focus-within:border-emerald-solid transition-all ${isArabic ? 'text-right' : 'text-left'}`}
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                  [{ 'direction': 'rtl' }, { 'align': [] }],
                  ['link', 'clean']
                ],
              }}
            />
            <style>{`
              .quill-wrapper.rtl .ql-editor {
                text-align: right;
                direction: rtl;
              }
              .quill-wrapper .ql-container {
                border-bottom-left-radius: 1rem;
                border-bottom-right-radius: 1rem;
                min-height: 200px;
              }
              .quill-wrapper .ql-toolbar {
                border-top-left-radius: 1rem;
                border-top-right-radius: 1rem;
                background: #f8fafc;
              }
            `}</style>
          </div>
        );

      // ================= CHECKBOX =================
      case "checkbox":
      case "boolean":
        return (
          <div className={`flex items-center justify-between px-5 h-14 rounded-2xl border transition-all
            ${value ? "bg-emerald-tint border-border-thin" : "bg-white border-slate-200"} shadow-sm ${isArabic ? 'flex-row-reverse' : ''}`}
          >
            <span className="font-semibold text-slate-600">
              {value ? "Active" : "Inactive"}
            </span>
            <div className="relative" onClick={() => onChange(field.key, value ? 0 : 1)}>
              {/* Track */}
              <div className={`w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer
                ${value ? "bg-emerald-500" : "bg-slate-200"}`}
              />
              {/* Thumb */}
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300
                ${value ? "left-7" : "left-1"}`}
              />
            </div>
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
          dir={isArabic ? "rtl" : "ltr"}
          onChange={(e) => onChange(field.key, e.target.value)}
          className={`${baseInputStyle} ${isArabic ? 'pr-12' : 'pl-12'}`}
        />

        <div className={`absolute ${isArabic ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-text-description group-focus-within:text-emerald-solid transition`}>
  ✎
</div>
      </div>
    );
  };

  return (
    // 👇 استخدام isFullWidth عشان يفرش الحقل في الـ Grid لو هو وصف
    <div className={`flex flex-col gap-1.5 animate-in fade-in slide-in-from-bottom-1 duration-300 ${isFullWidth ? "md:col-span-2" : ""}`}>
      <label className={labelStyle}>
        {field.label}
        {field.required ? (
          <span className="text-red-400 text-lg ml-1">*</span>
        ) : (
          <span className="text-slate-300 normal-case font-medium ml-2">(Optional)</span>
        )}
      </label>

      {renderInput()}

      {error && (
        <p className="text-red-500 text-xs font-bold ml-2 flex items-center gap-1 mt-1">
          ⚠ {Array.isArray(error) ? error[0] : error}
        </p>
      )}
    </div>
  );
}