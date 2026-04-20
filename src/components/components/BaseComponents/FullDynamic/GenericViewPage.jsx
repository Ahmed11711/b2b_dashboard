import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOne } from "../../../../service/services/apiService";

const getValueByPath = (obj, path) => {
  if (!path || !obj) return null;
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), obj);
};

const isImageValue = (val) => {
  const s = String(val ?? '');
  return (s.startsWith('http') || s.startsWith('/storage')) &&
    s.match(/\.(jpeg|jpg|gif|png|webp|svg)/i);
};

// ================= Relation Modal =================
function RelationModal({ isOpen, onClose, item, label }) {
  if (!isOpen || !item) return null;
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-slate-100 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-10 py-7 border-b border-slate-100 sticky top-0 bg-white z-10 rounded-t-[2.5rem]">
          <div className="flex items-center gap-3">
            <div className="w-2 h-7 bg-emerald-500 rounded-full"></div>
            <h3 className="text-xl font-black text-slate-800">{label}</h3>
          </div>
          <button onClick={onClose} className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-10 space-y-6">
          {/* الصور الأول */}
          <div className="flex flex-wrap gap-4">
            {Object.entries(item).map(([key, val]) => {
              if (!isImageValue(val)) return null;
              return (
                <div key={key} className="space-y-2">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{key.replace(/_/g, ' ')}</p>
                  <img src={String(val)} alt={key} className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-lg" />
                </div>
              );
            })}
          </div>
          {/* باقي الحقول */}
          <div className="grid grid-cols-2 gap-5">
            {Object.entries(item).map(([key, val]) => {
              if (typeof val === 'object' && val !== null) return null;
              if (isImageValue(val)) return null;
              return (
                <div key={key} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">{key.replace(/_/g, ' ')}</p>
                  <DynamicValueRenderer value={val} labelKey={key} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ================= Relation Cards =================
function RelationSection({ label, items, navigateTo }) {
  const navigate = useNavigate();
  const [modalItem, setModalItem] = useState(null);

  if (!items || !Array.isArray(items) || items.length === 0) return null;

  const handleCardClick = (item) => {
    if (navigateTo) navigate(navigateTo.replace(':id', item.id));
    else setModalItem(item);
  };

  return (
    <>
      <div className="space-y-5">
        <div className="flex items-center gap-3 px-1">
          <div className="w-2 h-7 bg-emerald-500 rounded-full"></div>
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-600">{label}</h3>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-black rounded-full border border-emerald-100">
            {items.length} items
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {items.map((item, idx) => {
            const imageEntry = Object.entries(item).find(([k, v]) => isImageValue(v));
            const titleVal = item.title || item.name || item.label || `Item #${item.id}`;
            const extraFields = Object.entries(item).filter(([k, v]) => {
              if (['title', 'name', 'label', 'id', 'bag_id'].includes(k)) return false;
              if (k.includes('_at')) return false;
              if (isImageValue(v)) return false;
              if (typeof v === 'object') return false;
              return true;
            });

            return (
              <div
                key={item.id || idx}
                onClick={() => handleCardClick(item)}
                className="group bg-white rounded-[1.75rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300 cursor-pointer overflow-hidden active:scale-95"
              >
                {/* صورة الـ Card */}
                {imageEntry ? (
                  <div className="relative h-44 overflow-hidden bg-slate-50">
                    <img
                      src={String(imageEntry[1])}
                      alt={titleVal}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 left-4 right-4">
                      <p className="text-white font-black text-sm drop-shadow-lg truncate">{titleVal}</p>
                      <p className="text-white/70 text-[11px] font-medium">ID: #{item.id}</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-16 bg-gradient-to-r from-emerald-50 to-slate-50 flex items-center px-5">
                    <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center">
                      <div className="w-2 h-4 bg-emerald-400 rounded-full"></div>
                    </div>
                  </div>
                )}

                {/* Card Body */}
                <div className="p-5">
                  {!imageEntry && (
                    <div className="mb-3">
                      <p className="font-black text-slate-800 truncate text-sm">{titleVal}</p>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">ID: #{item.id}</p>
                    </div>
                  )}

                  {extraFields.slice(0, 2).map(([k, v]) => (
                    <div key={k} className="mt-2 pt-2 border-t border-slate-50 first:border-0 first:mt-0 first:pt-0">
                      <p className="text-[10px] font-black uppercase text-slate-300 mb-1">{k.replace(/_/g, ' ')}</p>
                      <DynamicValueRenderer value={v} labelKey={k} />
                    </div>
                  ))}

                  <div className="mt-4 flex items-center justify-end">
                    <div className="w-7 h-7 rounded-xl bg-slate-50 group-hover:bg-emerald-50 flex items-center justify-center transition-colors">
                      <svg className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <RelationModal isOpen={!!modalItem} onClose={() => setModalItem(null)} item={modalItem} label={label} />
    </>
  );
}

// ================= Main Page =================
export default function GenericViewPage({ entityName, title, fields }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getOne(entityName, id);
        setData(res.data || res);
      } catch (err) {
        console.error("❌ Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [entityName, id]);

  if (loading) return <LoadingSkeleton />;
  if (!data) return <NotFound />;

  const mainFields = fields.filter(f => f.cell_type !== 'relation_list' && f.cell_type !== 'relation');
  const relationListFields = fields.filter(f => f.cell_type === 'relation_list');

  // فصل الصور عن باقي الحقول
  const imageFields = mainFields.filter(f => f.type === 'file' || f.cell_type === 'image');
  const regularFields = mainFields.filter(f => f.type !== 'file' && f.cell_type !== 'image');

  return (
    <div className="min-h-screen bg-[#f8f9fb] py-10 px-4 md:px-10">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* ===== Header ===== */}
        <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
              <div className="w-3 h-8 bg-emerald-500 rounded-full"></div>
            </div>
            <div>
              {/* ✅ إزالة تكرار Details */}
              <h2 className="text-3xl font-black text-slate-900 capitalize">{title}</h2>
              <p className="text-slate-400 font-medium mt-1">
                Record ID: <span className="text-emerald-600 font-black">#{id}</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-all active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

        {/* ===== Main Details ===== */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-10 py-6 border-b border-slate-100 flex items-center gap-3">
            <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-600">Main Details</h3>
          </div>

          <div className="p-10 space-y-10">
            {/* الصور في الأعلى */}
            {imageFields.length > 0 && (
              <div className="flex flex-wrap gap-8">
                {imageFields.map(field => (
                  <div key={field.key} className="space-y-3">
                    <label className="block text-[11px] font-black uppercase text-slate-400 tracking-widest">{field.label}</label>
                    {data[field.key] ? (
                      <div className="relative group w-fit">
                        <img
                          src={data[field.key]}
                          alt={field.label}
                          className="w-36 h-36 rounded-3xl object-cover border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300"
                        />
                        <a href={data[field.key]} target="_blank" rel="noreferrer"
                          className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl text-white text-[10px] font-black uppercase">
                          View
                        </a>
                      </div>
                    ) : (
                      <div className="w-36 h-36 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center">
                        <span className="text-slate-300 text-xs font-bold">No Image</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* باقي الحقول */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularFields.map(field => (
                <div key={field.key} className={field.type === 'textarea' ? 'md:col-span-3' : ''}>
                  <label className="block text-[11px] font-black uppercase text-slate-400 mb-3 tracking-widest">{field.label}</label>
                  <div className="bg-slate-50 rounded-2xl px-5 py-3 border border-slate-100 min-w-[100px] w-fit">
                    <DynamicValueRenderer value={data[field.key]} field={field} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== Relation List من الـ Schema ===== */}
        {relationListFields.map((relField, idx) => (
          <RelationSection
            key={idx}
            label={relField.label}
            items={data[relField.key] || []}
            navigateTo={relField.navigate_to || null}
          />
        ))}

        {/* ===== Auto-detect Relations ===== */}
        {Object.entries(data).map(([key, val]) => {
          if (!Array.isArray(val) || val.length === 0) return null;
          if (relationListFields.find(f => f.key === key)) return null;
          return (
            <RelationSection
              key={key}
              label={key.replace(/_/g, ' ')}
              items={val}
              navigateTo={null}
            />
          );
        })}

      </div>
    </div>
  );
}

// ================= Dynamic Value Renderer =================
function DynamicValueRenderer({ value, field }) {
  if (value === null || value === undefined) return <span className="text-slate-300">N/A</span>;

  const stringValue = String(value);
  const keyName = field?.key ? field.key.toLowerCase() : "";
  const type = field?.type || "";

  if (type === "rich-text") {
    const isAr = value && /[\u0600-\u06FF]/.test(value);
    return (
      <div 
        className={`text-slate-700 leading-relaxed prose prose-slate max-w-none ${isAr ? "text-right" : ""}`}
        dir={isAr ? "rtl" : "ltr"}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    );
  }

  if (isImageValue(value)) {
    return (
      <div className="relative group w-fit">
        <img src={stringValue} alt="img" className="w-24 h-24 rounded-2xl object-cover border-2 border-white shadow hover:scale-105 transition-all duration-300" />
        <a href={stringValue} target="_blank" rel="noreferrer"
          className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl text-white text-[9px] font-black uppercase">
          View
        </a>
      </div>
    );
  }

  if (value === 0 || value === 1 || value === true || value === false) {
    const isActive = value == 1 || value === true;
    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
        isActive ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-rose-100 text-rose-700 border-rose-200"
      }`}>
        {isActive ? "Yes" : "No"}
      </span>
    );
  }

  if (keyName.includes('status')) {
    const statusColors = {
      pending: "bg-amber-100 text-amber-700 border-amber-200",
      active: "bg-emerald-100 text-emerald-700 border-emerald-200",
      confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
      canceled: "bg-rose-100 text-rose-700 border-rose-200",
      expired: "bg-slate-100 text-slate-400 border-slate-200"
    };
    const colorClass = statusColors[stringValue.toLowerCase()] || "bg-blue-100 text-blue-700 border-blue-200";
    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${colorClass}`}>
        {stringValue}
      </span>
    );
  }

  if (stringValue.length > 60) {
    return <p className="text-slate-600 text-sm leading-relaxed max-w-xs">{stringValue}</p>;
  }

  return <span className="text-slate-700 font-bold">{stringValue}</span>;
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#f8f9fb] py-10 px-4 md:px-10">
      <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
        <div className="h-28 bg-white rounded-[2.5rem] border border-slate-100"></div>
        <div className="h-64 bg-white rounded-[2.5rem] border border-slate-100"></div>
        <div className="grid grid-cols-3 gap-5">
          <div className="h-48 bg-white rounded-[2rem] border border-slate-100"></div>
          <div className="h-48 bg-white rounded-[2rem] border border-slate-100"></div>
          <div className="h-48 bg-white rounded-[2rem] border border-slate-100"></div>
        </div>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto">
          <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <p className="text-xl font-black text-slate-400">Record not found.</p>
      </div>
    </div>
  );
}