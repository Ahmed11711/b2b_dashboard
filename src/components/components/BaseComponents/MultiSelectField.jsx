// components/MultiSelectField.jsx
import { useState, useEffect, useRef } from "react";
import { getAll } from "../../../service/services/apiService";

export default function MultiSelectField({ field, value = [], onChange, error }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  // جيب البيانات من الـ endpoint
  useEffect(() => {
    if (!field.endpoint && !Array.isArray(field.options)) return;
    if (Array.isArray(field.options)) { setOptions(field.options); return; }

    setLoading(true);
    getAll(field.endpoint).then(res => {
      const raw = res.data || res;
      const labelKey = field.optionLabel || "name";
      const valueKey = field.optionValue || "id";
      setOptions(Array.isArray(raw) ? raw.map(i => ({ label: i[labelKey], value: i[valueKey] })) : []);
    }).finally(() => setLoading(false));
  }, [field.endpoint]);

  // إغلاق الـ dropdown لو الكلك برا
  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = Array.isArray(value) ? value : [];
  const filtered = options.filter(o => o.label?.toLowerCase().includes(search.toLowerCase()));

  const toggle = (opt) => {
    const exists = selected.includes(opt.value);
    onChange(field.key, exists ? selected.filter(v => v !== opt.value) : [...selected, opt.value]);
  };

  const removeChip = (val) => onChange(field.key, selected.filter(v => v !== val));

  const getLabel = (val) => options.find(o => o.value == val)?.label || val;

  // لو اختيار واحد بس → Dropdown عادي
  if (field.single) {
    return (
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1 ml-1">
          {field.label}
        </label>
        <div className="relative">
          <select
            value={value || ""}
            onChange={(e) => onChange(field.key, e.target.value)}
            disabled={loading}
            className={`w-full h-11 px-4 py-2 border rounded-lg bg-white outline-none transition-all duration-300 focus:border-emerald-solid focus:ring-4 focus:ring-emerald-solid/10 text-sm text-carbon-black placeholder:text-slate-400 ${error ? "border-red-500 focus:ring-red-500 bg-red-50/50" : "border-border-thin hover:border-border-light"} ${loading ? "opacity-50 cursor-not-allowed" : "appearance-none"}`}
          >
            <option value="">{loading ? "جاري التحميل..." : `اختر ${field.label}`}</option>
            {options.map((o, i) => <option key={i} value={o.value}>{o.label}</option>)}
          </select>
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5 relative" ref={ref}>
      <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1 ml-1">
        {field.label}
        {field.required ? <span className="text-red-400 text-lg ml-1">*</span> : <span className="text-slate-300 normal-case font-medium ml-2">(Optional)</span>}
      </label>

      {/* الـ Chips Bar */}
      <div
        onClick={() => setOpen(o => !o)}
        className={`min-h-[44px] px-4 py-2 rounded-lg border bg-white cursor-pointer
          flex flex-wrap gap-2 items-center transition-all duration-300
          ${open ? "border-emerald-solid ring-4 ring-emerald-solid/10" : "border-border-thin hover:border-border-light"}
          ${error ? "border-red-500 bg-red-50/50" : ""}
        `}
      >
        {selected.length === 0 && (
          <span className="text-text-description text-sm font-medium">
            {loading ? "جاري التحميل..." : `اختر ${field.label}...`}
          </span>
        )}

        {selected.map(val => (
          <span key={val} className="inline-flex items-center gap-1 bg-emerald-tint border border-emerald-solid/20 
            text-emerald-text text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            {getLabel(val)}
            <button onClick={(e) => { e.stopPropagation(); removeChip(val); }}
              className="ml-1 text-emerald-solid/60 hover:text-red-500 transition-colors">×</button>
          </span>
        ))}

        <span className={`ml-auto text-text-description text-xs transition-transform duration-200 ${open ? "rotate-180" : ""}`}>▼</span>
      </div>

      {/* الـ Dropdown */}
      {open && (
        <div className="absolute z-[100] mt-1 w-full rounded-2xl border border-border-thin bg-white shadow-xl overflow-hidden" style={{ top: "100%" }}>
          <div className="px-4 py-3 border-b border-border-light bg-slate-50/50">
            <input
              autoFocus
              value={search}
              onChange={e => setSearch(e.target.value)}
              onClick={e => e.stopPropagation()}
              placeholder="Search..."
              className="w-full text-sm outline-none bg-transparent text-carbon-gray placeholder:text-text-description font-medium"
            />
          </div>

          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {filtered.length === 0 && (
              <p className="text-center text-sm text-text-description py-6">No results found</p>
            )}
            {filtered.map((opt) => {
              const isSelected = selected.includes(opt.value);
              return (
                <div key={opt.value} onClick={() => toggle(opt)}
                  className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors text-sm font-medium
                    ${isSelected ? "bg-emerald-tint/60 text-emerald-text" : "text-carbon-gray hover:bg-slate-50"}`}>
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all flex-shrink-0
                    ${isSelected ? "bg-emerald-solid border-emerald-solid" : "border-slate-300"}`}>
                    {isSelected && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                    </svg>}
                  </div>
                  {opt.label}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {error && <p className="text-red-500 text-xs font-bold ml-2">⚠ {Array.isArray(error) ? error[0] : error}</p>}
    </div>
  );
}