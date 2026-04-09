import { useState, useEffect, useRef, memo, useCallback } from "react";
import { getAll } from "../../../service/services/apiService"; // تأكد من المسار الصحيح

/**
 * FormFieldRenderer - مكون عرض الحقول الذكي المطور
 * يدعم: العلاقات الديناميكية، الصور، التبديل، والنصوص
 */
const FormFieldRenderer = memo(({ field, value, onChange, error, disabled = false }) => {
  console.log("🔥 FormFieldRenderer is ALIVE! Field Key:", field?.key);
  const { 
    key = "", 
    label = "Field", 
    type = "text", 
    placeholder = "", 
    options: initialOptions , 
    required = false,
    endpoint = null,
    relation_fields = null
  } = field;

  const [preview, setPreview] = useState(null);
  const [dynamicOptions, setDynamicOptions] = useState(Array.isArray(initialOptions) ? initialOptions : []);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // --- 1. إدارة العلاقات الديناميكية (الـ Select المعتمد على API) ---
  useEffect(() => {
    
    const isRelation = type === "select" && !Array.isArray(initialOptions) && initialOptions !== null;

    if (isRelation) {
      console.log("✅ Entering Relation Logic for:", key);
      const fetchRelations = async () => {
        setLoading(true);
        try {
          // استنتاج المسار: الأولوية للـ endpoint الصريح ثم التخمين من الـ key
          const targetPath = endpoint || key.replace("_id", "s");
                    console.log("🚀 Sending to API:", { targetPath, queryParams }); // شوف دي في الكونسول

          const queryParams = {};
          if (relation_fields) {
            queryParams.fields = relation_fields;
          }

          const response = await getAll(targetPath, queryParams);
          const rawData = response.data || response;

          const labelKey = field.options?.label || "name";
          const valueKey = field.options?.value || "id";

          const formatted = Array.isArray(rawData) ? rawData.map(item => ({
            label: item[labelKey],
            value: item[valueKey]
          })) : [];

          setDynamicOptions(formatted);
        } catch (err) {
          console.error(`❌ Relation Error [${key}]:`, err);
        } finally {
          setLoading(false);
        }
      };
      fetchRelations();
    }
  }, [field, key, type, initialOptions, endpoint, relation_fields]);

  // --- 2. إدارة معاينة الصور ---
 // --- 1. إدارة العلاقات الديناميكية (الـ Select المعتمد على API) ---
  useEffect(() => {
    // الشرط المحدث: ادخل لو النوع select وعندك endpoint أو مفيش خيارات جاهزة
    const isRelation = type === "select" && (endpoint !== null || !Array.isArray(initialOptions) || initialOptions.length === 0);

    if (isRelation) {
      console.log("✅ [MATCHED] Starting Fetch Logic for:", key);
      
      const fetchRelations = async () => {
        setLoading(true);
        try {
          const targetPath = endpoint || key.replace("_id", "s");
          
          const queryParams = {};
          if (relation_fields) {
            queryParams.fields = relation_fields;
          }

          console.log("🚀 [API CALL] Path:", targetPath, "Params:", queryParams);

          const response = await getAll(targetPath, queryParams);
          const rawData = response.data || response;

          const labelKey = field.options?.label || "name";
          const valueKey = field.options?.value || "id";

          const formatted = Array.isArray(rawData) ? rawData.map(item => ({
            label: item[labelKey],
            value: item[valueKey]
          })) : [];

          setDynamicOptions(formatted);
          console.log("✨ [SUCCESS] Data Loaded for:", key);
        } catch (err) {
          console.error(`❌ [ERROR] Relation [${key}]:`, err);
        } finally {
          setLoading(false);
        }
      };
      fetchRelations();
    } else {
      console.log("⏭️ [SKIPPED] Field is not a dynamic relation:", key);
    }
  }, [field, key, type, initialOptions, endpoint, relation_fields]);
  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    onChange(key, file instanceof File ? file : null);
  }, [key, onChange]);

  const removeImage = (e) => {
    e.stopPropagation();
    setPreview(null);
    onChange(key, null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // --- Styles ---
  const labelStyle = `text-[10px] font-black uppercase tracking-[0.2em] mb-2 ml-2 block transition-colors duration-300 ${
    error ? "text-red-500" : "text-slate-400 group-focus-within:text-emerald-600"
  }`;

  const inputBaseStyle = `
    w-full h-14 px-6 rounded-2xl bg-slate-50 border-2 border-transparent
    text-slate-700 font-bold transition-all duration-500 outline-none
    focus:bg-white focus:border-emerald-500/20 focus:ring-[6px] focus:ring-emerald-500/5
    placeholder:text-slate-300 disabled:opacity-50
  `;

  // --- Renderers ---
  const renderImageUpload = () => (
    <div className="flex flex-col group">
      <span className={labelStyle}>{label} {required && "*"}</span>
      <div 
        onClick={() => !disabled && fileInputRef.current.click()}
        className={`relative h-56 w-full rounded-[2.5rem] border-2 border-dashed overflow-hidden transition-all duration-700 bg-slate-50 group ${preview ? "border-emerald-500/20 shadow-xl shadow-emerald-500/5" : "border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/20"} ${error ? "border-red-200 bg-red-50/50" : ""}`}
      >
        {preview ? (
          <div className="h-full w-full relative group">
            <img src={preview} alt="preview" className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" />
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[2px]">
              <button type="button" onClick={removeImage} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-red-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
              <span className="bg-white px-6 py-2.5 rounded-2xl text-slate-900 text-[10px] font-black uppercase tracking-widest shadow-xl pointer-events-none">Change Image</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-4 transition-transform duration-500 group-hover:scale-105">
            <div className="w-16 h-16 rounded-[1.5rem] bg-white shadow-sm flex items-center justify-center text-slate-300 group-hover:text-emerald-500 group-hover:shadow-emerald-100 transition-all duration-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4"/></svg>
            </div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Upload {label}</span>
          </div>
        )}
      </div>
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
    </div>
  );

  const renderToggle = () => (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border-2 border-transparent group-focus-within:border-emerald-500/10 transition-all">
      <div className="flex flex-col">
        <span className="text-[11px] font-black uppercase tracking-widest text-slate-700">{label}</span>
        <span className="text-[9px] text-slate-400 font-bold uppercase mt-1">
          {value ? "Enabled / Active" : "Disabled / Inactive"}
        </span>
      </div>
      <button
        type="button"
        onClick={() => !disabled && onChange(key, value ? 0 : 1)}
        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none ${value ? "bg-emerald-500" : "bg-slate-300"}`}
      >
        <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${value ? "translate-x-7" : "translate-x-1"}`} />
      </button>
    </div>
  );

  // منطق الاختيار
  const lowerKey = key?.toLowerCase() || "";
  const isImage = type === "file" || type === "img" || lowerKey.includes("image") || lowerKey.includes("logo");
  const isDescription = type === "textarea" || lowerKey.includes("desc") || lowerKey.includes("content");
  const isBoolean = type === "boolean" || type === "checkbox" || lowerKey.startsWith("is_") || lowerKey.startsWith("has_");

  let content;
  if (isImage) {
    content = renderImageUpload();
  } else if (isDescription) {
    content = (
      <div className="col-span-full group">
        <span className={labelStyle}>{label} {required && "*"}</span>
        <textarea
          name={key}
          value={value || ""}
          onChange={(e) => onChange(key, e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          rows={5}
          className={`${inputBaseStyle} h-auto py-6 px-7 resize-none ${error ? "border-red-100 bg-red-50/30" : ""}`}
        />
      </div>
    );
  } else if (isBoolean) {
    content = renderToggle();
  } else {
    content = (
      <div className="flex flex-col group">
        <span className={labelStyle}>{label} {required && "*"}</span>
        {type === "select" ? (
          <div className="relative">
            <select
              value={value || ""}
              onChange={(e) => onChange(key, e.target.value)}
              disabled={disabled || loading}
              className={`${inputBaseStyle} appearance-none pr-12 cursor-pointer ${error ? "border-red-100 bg-red-50/30" : ""}`}
            >
              <option value="">{loading ? "Loading..." : `Select ${label}`}</option>
              {dynamicOptions.map((opt, i) => (
                <option key={i} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-emerald-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"/></svg>
            </div>
          </div>
        ) : (
          <input
            name={key}
            type={type}
            value={value ?? ""} 
            onChange={(e) => onChange(key, e.target.value)}
            disabled={disabled}
            placeholder={placeholder}
            className={`${inputBaseStyle} ${error ? "border-red-100 bg-red-50/30" : ""}`}
          />
        )}
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      {content}
      {error && (
        <span className="text-[9px] font-black text-red-500 mt-2 ml-4 uppercase tracking-[0.1em] block">
          {Array.isArray(error) ? error[0] : error}
        </span>
      )}
    </div>
  );
});

export default FormFieldRenderer;