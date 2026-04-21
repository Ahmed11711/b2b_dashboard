import { useState, useEffect } from "react";
import { getAll } from "../../../service/services/apiService";
import MultiSelectField from "../../components/BaseComponents/MultiSelectField";
import ReactQuill from 'react-quill-new';
import "react-quill/dist/quill.snow.css";



export default function FormFieldRendererLayout({ field, value, onChange, error, disabled }) {
  const [options, setOptions] = useState(Array.isArray(field?.options) ? field.options : []);
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);

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

 const isFullWidth = 
  field.type === "textarea" || 
  field.type === "file" ||
  field.type === "gallery" ||   // ← أضيف السطر ده
  field.key?.toLowerCase().includes("description") || 
  field.key?.toLowerCase().includes("desc");
  // 👇 الجزء المضاف: تنظيف القيمة من الـ 0 أو الـ null لو الحقل اختياري
  const displayValue = (value === null || value === undefined) ? "" : value;

  const stripHtml = (html = "") => {
    if (typeof window === "undefined") return String(html);
    const div = document.createElement("div");
    div.innerHTML = String(html);
    return div.textContent || div.innerText || "";
  };

  const escapeHtml = (text = "") =>
    String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  const translateContent = async (targetLang) => {
    const sourceText = stripHtml(displayValue).trim();
    if (!sourceText || disabled || translating) return;

    setTranslating(true);
    try {
      const sourceLang = targetLang === "ar" ? "en" : "ar";
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(sourceText)}&langpair=${sourceLang}|${targetLang}`;
      const response = await fetch(url);
      const result = await response.json();
      const translated = result?.responseData?.translatedText;

      if (translated) {
        onChange(field.key, `<p>${escapeHtml(translated)}</p>`);
      }
    } catch (translateError) {
      console.error("Translation failed:", translateError);
    } finally {
      setTranslating(false);
    }
  };

  // ================= STYLES =================

 const baseInputStyle = `
w-full min-h-[56px] px-5 rounded-[20px] border bg-card-bg/80 backdrop-blur-sm border-border-thin
focus:border-emerald-solid focus:ring-4 focus:ring-emerald-solid/10 outline-none font-medium text-carbon-black
placeholder:text-text-description/50 transition-all duration-300 shadow-sm hover:shadow-md pt-3 pb-1
${error ? "border-red-300 bg-red-50/40 focus:ring-red-100" : ""}
`;

  const labelStyle = `
  absolute top-1 left-4 px-1 text-[11px] font-medium text-text-description bg-transparent pointer-events-none z-10
  `;

  // ================= INPUT RENDER =================

  const renderInput = () => {
    switch (field.type) {
      // ================= SELECT =================
      case "select":
        return (
          <div className="relative group h-full">
            <select
              name={field.key}
              value={displayValue}
              disabled={disabled || loading}
              onChange={(e) => onChange(field.key, e.target.value)}
              className={`${baseInputStyle} appearance-none cursor-pointer pr-10 pt-4 pb-1 ${
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
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        );








case "gallery":
  const galleryFiles = Array.isArray(value) ? value : [];

  const FILE_TYPES = [
    { label: "Image", value: "image", accept: "image/*", icon: "🖼️" },
    { label: "PDF",   value: "pdf",   accept: ".pdf",    icon: "📄" },
    { label: "Word",  value: "word",  accept: ".doc,.docx", icon: "📝" },
    { label: "Excel", value: "excel", accept: ".xls,.xlsx", icon: "📊" },
    { label: "Video", value: "video", accept: "video/*", icon: "🎬" },
  ];

  const [selectedType, setSelectedType] = useState("image");

  const currentAccept = FILE_TYPES.find(t => t.value === selectedType)?.accept || "*";

  const handleGalleryAdd = (e) => {
    const files = Array.from(e.target.files).map(file => ({
      file,
      type: selectedType,
      preview: selectedType === "image" ? URL.createObjectURL(file) : null,
      name: file.name,
    }));
    onChange(field.key, [...galleryFiles, ...files]);
    e.target.value = "";
  };

  const handleGalleryRemove = (index) => {
    const updated = galleryFiles.filter((_, i) => i !== index);
    onChange(field.key, updated);
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-[12px] font-medium text-text-description px-1">
        {field.label}
      </label>

      {/* Type Selector */}
      <div className="flex flex-wrap gap-2">
        {FILE_TYPES.map(t => (
          <button
            key={t.value}
            type="button"
            onClick={() => setSelectedType(t.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200
              ${selectedType === t.value
                ? "bg-emerald-solid text-white border-emerald-solid shadow"
                : "bg-card-bg text-text-description border-border-thin hover:border-emerald-solid/50"
              }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Upload Area */}
      <div className="relative border border-dashed border-emerald-solid/50 bg-emerald-tint/20 rounded-[20px] p-5 text-center hover:bg-emerald-tint/40 transition-all cursor-pointer">
        <input
          type="file"
          accept={currentAccept}
          multiple
          onChange={handleGalleryAdd}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center gap-1.5 pointer-events-none">
          <svg className="w-6 h-6 text-emerald-solid" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <p className="text-text-description text-xs font-medium">
            Upload {FILE_TYPES.find(t => t.value === selectedType)?.label} files
          </p>
        </div>
      </div>

      {/* Preview Grid */}
      {galleryFiles.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-1">
          {galleryFiles.map((item, index) => (
            <div key={index} className="relative group rounded-2xl border border-border-light overflow-hidden shadow-sm bg-slate-50">
              {item.preview ? (
                <img src={item.preview} className="w-full h-20 object-cover" alt={item.name} />
              ) : (
                <div className="w-full h-20 flex flex-col items-center justify-center gap-1">
                  <span className="text-2xl">
                    {FILE_TYPES.find(t => t.value === item.type)?.icon || "📁"}
                  </span>
                  <span className="text-[10px] text-text-description text-center px-1 truncate w-full text-center">
                    {item.name}
                  </span>
                </div>
              )}

              {/* Type Badge */}
              <span className="absolute top-1 left-1 bg-emerald-solid text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                {item.type}
              </span>

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => handleGalleryRemove(index)}
                className="absolute top-1 right-1 p-1 bg-status-error-bg text-status-error-text rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
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
            <div className="relative mt-2">
               {/* Label for textarea positioned to look like integrated floating label */}
               <label className="absolute -top-2.5 left-4 px-1 bg-card-bg text-[12px] text-text-description font-medium z-10">{field.label}</label>
               <div className="bg-card-bg rounded-[20px] border border-border-light overflow-hidden transition-all duration-300 hover:shadow-md focus-within:border-emerald-solid focus-within:ring-4 focus-within:ring-emerald-solid/10">
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
            </div>
          );
        }
         break;

      // ================= CHECKBOX =================
      case "checkbox":
      case "boolean":
        return (
          <div className="flex items-center justify-between p-4 md:p-5 bg-slate-50 rounded-[20px] border border-border-light hover:border-emerald-solid/20 transition-all duration-300 shadow-sm hover:shadow h-[56px] mt-2">
            <div className="flex flex-col">
              <span className="text-xs md:text-sm font-bold tracking-tight text-carbon-black capitalize">{field.label}</span>
            </div>
            <button
              type="button"
              onClick={() => !disabled && onChange(field.key, value ? 0 : 1)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-solid/20 shadow-inner ${value ? "bg-emerald-solid" : "bg-slate-300"}`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${value ? "translate-x-5" : "translate-x-1"}`} />
            </button>
          </div>
        );
      // ================= FILE =================
      case "file":
        return (
          <div className="flex flex-col gap-3 relative mt-2">
            {/* Same floating label style for consistency */}
            <label className="absolute -top-2 left-4 px-1 bg-card-bg text-[11px] font-medium text-text-description pointer-events-none z-10">
              {field.label}
              {field.required ? (
                <span className="text-status-error-text text-sm ml-0.5">*</span>
              ) : null}
            </label>
            <div className="relative w-full">
              <div className="relative group border border-dashed border-emerald-solid/50 bg-emerald-tint/20 rounded-[20px] p-6 w-full text-center hover:bg-emerald-tint/40 transition-all cursor-pointer mt-0 min-h-[120px] flex items-center justify-center overflow-hidden">
                <input
                  type="file"
                  onChange={(e) => onChange(field.key, e.target.files[0])}
                  className="absolute inset-0 opacity-0 cursor-pointer z-20"
                />

                {/* If no value, show upload prompt */}
                {!value && (
                  <div className="flex flex-col items-center gap-2 z-10">
                    <div className="text-xl text-emerald-solid group-hover:-translate-y-1 transition-transform">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    </div>

                    <p className="text-text-description font-medium text-xs">
                      Click or drag to upload
                    </p>
                  </div>
                )}

                {/* If value exists, show image filling the box */}
                {value && (
                  <>
                    <img
                      src={value instanceof File ? URL.createObjectURL(value) : value}
                      className="absolute inset-0 w-full h-full object-cover"
                      alt="preview"
                    />
                    {/* Hover overlay with action buttons */}
                    <div className="absolute inset-0 bg-carbon-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 z-10">
                      <div className="flex flex-col items-center gap-1 cursor-pointer">
                         <span className="text-white text-xs font-medium">Click to change</span>
                      </div>
                      
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          onChange(field.key, null);
                        }}
                        className="p-2 bg-status-error-bg text-status-error-text rounded-full hover:scale-110 transition-transform relative z-30"
                        title="Remove Image"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );
    
case "multi-select":
  return (
    <div className="mt-2">
      <label className="text-[12px] font-medium text-text-description px-1 mb-1 block">{field.label}</label>
      <MultiSelectField
        field={field}
        value={value}
        onChange={onChange}
        error={error}
      />
    </div>
  );
    }
    // ================= DEFAULT (للحالات العادية) =================
    return (
      <div className="relative group h-[56px]">
        <input
          type={field.type || "text"}
          name={field.key}
          value={displayValue}
          placeholder={field.placeholder || `Enter ${field.label}`}
          disabled={disabled}
          onChange={(e) => onChange(field.key, e.target.value)}
          className={`${baseInputStyle}`}
        />
      </div>
    );
  };

  return (
    // 👇 استخدام isFullWidth عشان يفرش الحقل في الـ Grid لو هو وصف
    <div className={`relative flex flex-col justify-start animate-in fade-in slide-in-from-bottom-1 duration-500 ${isFullWidth ? "md:col-span-2" : ""} ${field.type === 'multi-select' ? 'relative z-10 focus-within:z-20' : ''}`}>
      {field.type !== "checkbox" && field.type !== "boolean" && field.type !== "multi-select" && field.type !== "file" && (!isFullWidth || (field.type !== 'textarea' && field.type !== 'text')) && (
        <label className="absolute -top-2 left-4 px-1 bg-card-bg text-[11px] font-medium text-text-description pointer-events-none z-10">
          {field.label}
          {field.required ? (
            <span className="text-status-error-text text-sm ml-0.5">*</span>
          ) : null}
        </label>
      )}

      {renderInput()}

      {error && (
        <p className="text-status-error-text text-xs font-bold ml-4 flex items-center gap-1 mt-1">
          ⚠ {Array.isArray(error) ? error[0] : error}
        </p>
      )}
    </div>
  );
}