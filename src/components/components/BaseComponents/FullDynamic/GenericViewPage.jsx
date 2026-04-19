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
      <div className="space-y-4 md:space-y-5">
        <div className="flex flex-wrap items-center gap-3 px-1">
          <div className="w-2 h-6 md:h-7 bg-emerald-solid rounded-full shadow-sm"></div>
          <h3 className="text-xs md:text-sm font-bold uppercase tracking-widest text-heading-slate">{label}</h3>
          <span className="px-2.5 py-1 md:px-3 md:py-1.5 bg-emerald-tint text-emerald-text text-[10px] md:text-xs font-bold rounded-full border border-emerald-solid/20 shadow-sm">
            {items.length} items
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
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
                className="group bg-white rounded-3xl border border-border-light shadow-[0_2px_8px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgb(0,0,0,0.08)] hover:border-emerald-solid/30 transition-all duration-300 cursor-pointer overflow-hidden active:scale-[0.98] flex flex-col"
              >
                {/* صورة الـ Card */}
                {imageEntry ? (
                  <div className="relative h-40 md:h-44 overflow-hidden bg-slate-50 shrink-0">
                    <img
                      src={imageEntry[1]}
                      alt="Thumbnail"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-carbon-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ) : (
                  <div className="h-2 bg-emerald-solid/10 shrink-0"></div>
                )}

                {/* محتوى الـ Card */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <h4 className="font-bold text-carbon-black text-base line-clamp-1 group-hover:text-emerald-solid transition-colors">{titleVal}</h4>
                    <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-lg border border-border-light shrink-0 shadow-sm">
                      #{item.id}
                    </span>
                  </div>

                  <div className="flex-1">
                    {extraFields.slice(0, 2).map(([k, v]) => (
                      <div key={k} className="mt-2 pt-2 border-t border-border-light/50 first:border-0 first:mt-0 first:pt-0">
                        <p className="text-[9px] md:text-[10px] font-bold uppercase text-slate-400 mb-1">{k.replace(/_/g, ' ')}</p>
                        <DynamicValueRenderer value={v} labelKey={k} />
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-end shrink-0">
                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-slate-50 border border-border-light group-hover:bg-emerald-solid group-hover:border-emerald-solid flex items-center justify-center transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:-translate-y-0.5">
                      <svg className="w-4 h-4 md:w-4 md:h-4 text-slate-400 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    <div className="min-h-screen bg-bg-surface py-10 px-4 md:px-10">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* ===== Header ===== */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-border-light transition-all hover:shadow-md">
          <div className="flex items-center gap-4 md:gap-5">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-emerald-tint flex items-center justify-center shrink-0 shadow-inner">
              <div className="w-2.5 md:w-3 h-6 md:h-8 bg-emerald-solid rounded-full"></div>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-carbon-black capitalize tracking-tight">{title}</h2>
              <p className="text-slate-500 font-medium mt-1 text-sm md:text-base">
                Record ID: <span className="text-emerald-solid font-black">#{id}</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 bg-slate-50 hover:bg-emerald-tint text-carbon-gray hover:text-emerald-text font-bold rounded-2xl transition-all duration-300 active:scale-[0.98] border border-border-light hover:border-emerald-solid/20 shadow-sm"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

        {/* ===== Main Details ===== */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-border-light overflow-hidden transition-all hover:shadow-md">
          <div className="px-6 md:px-10 py-5 md:py-6 border-b border-border-light flex items-center gap-3 bg-slate-50/50">
            <div className="w-2 h-6 bg-emerald-solid rounded-full shadow-sm"></div>
            <h3 className="text-xs md:text-sm font-bold uppercase tracking-widest text-heading-slate">Main Details</h3>
          </div>

          <div className="p-6 md:p-10 space-y-8 md:space-y-10">
            {/* الصور في الأعلى */}
            {imageFields.length > 0 && (
              <div className="flex flex-wrap gap-6 md:gap-8">
                {imageFields.map(field => (
                  <div key={field.key} className="space-y-3">
                    <label className="block text-[10px] md:text-[11px] font-bold uppercase text-slate-500 tracking-widest">{field.label}</label>
                    {data[field.key] ? (
                      <div className="relative group w-fit">
                        <img
                          src={data[field.key]}
                          alt={field.label}
                          className="w-32 h-32 md:w-36 md:h-36 rounded-3xl object-cover border-4 border-white shadow-md group-hover:shadow-xl group-hover:scale-[1.02] transition-all duration-300"
                        />
                        <a href={data[field.key]} target="_blank" rel="noreferrer"
                          className="absolute inset-0 flex items-center justify-center bg-carbon-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-3xl text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                          View Image
                        </a>
                      </div>
                    ) : (
                      <div className="w-32 h-32 md:w-36 md:h-36 rounded-3xl bg-slate-50 border-2 border-dashed border-border-thin flex items-center justify-center transition-colors hover:bg-slate-100">
                        <span className="text-slate-400 text-xs font-bold">No Image</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* باقي الحقول */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {regularFields.map(field => (
                <div key={field.key} className={field.type === 'textarea' ? 'sm:col-span-2 lg:col-span-3' : ''}>
                  <label className="block text-[10px] md:text-[11px] font-bold uppercase text-slate-500 mb-2 md:mb-3 tracking-widest">{field.label}</label>
                  <div className="bg-slate-50 rounded-2xl px-4 py-3 md:px-5 md:py-3.5 border border-border-light min-w-[100px] w-full sm:w-fit transition-colors hover:bg-white hover:border-emerald-solid/20 shadow-sm hover:shadow">
                    <DynamicValueRenderer value={data[field.key]} labelKey={field.key} />
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
function DynamicValueRenderer({ value, labelKey }) {
  if (value === null || value === undefined || value === "") return <span className="text-slate-400 font-medium italic">Not specified</span>;

  const stringValue = String(value);
  const keyName = labelKey ? labelKey.toLowerCase() : "";

  if (isImageValue(value)) {
    return (
      <div className="relative group w-fit">
        <img src={stringValue} alt="img" className="w-24 h-24 rounded-2xl object-cover border-2 border-border-light shadow-sm hover:scale-105 transition-all duration-300" />
        <a href={stringValue} target="_blank" rel="noreferrer"
          className="absolute inset-0 flex items-center justify-center bg-carbon-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl text-white text-[10px] font-bold uppercase tracking-widest backdrop-blur-[2px]">
          View
        </a>
      </div>
    );
  }

  if (value === 0 || value === 1 || value === true || value === false) {
    const isActive = value == 1 || value === true;
    return (
      <span className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border shadow-sm ${
        isActive ? "bg-emerald-tint text-emerald-text border-emerald-solid/20" : "bg-rose-50 text-rose-700 border-rose-200"
      }`}>
        {isActive ? "Yes" : "No"}
      </span>
    );
  }

  if (keyName.includes('status')) {
    const statusColors = {
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      active: "bg-emerald-tint text-emerald-text border-emerald-solid/20",
      confirmed: "bg-emerald-tint text-emerald-text border-emerald-solid/20",
      canceled: "bg-rose-50 text-rose-700 border-rose-200",
      expired: "bg-slate-50 text-slate-500 border-slate-200"
    };
    const colorClass = statusColors[stringValue.toLowerCase()] || "bg-blue-50 text-blue-700 border-blue-200";
    return (
      <span className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border shadow-sm ${colorClass}`}>
        {stringValue}
      </span>
    );
  }

  if (stringValue.length > 60) {
    return <p className="text-carbon-gray text-sm leading-relaxed max-w-full whitespace-pre-wrap">{stringValue}</p>;
  }

  return <span className="text-carbon-black font-semibold text-base">{stringValue}</span>;
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-bg-surface py-10 px-4 md:px-10">
      <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
        <div className="h-28 bg-white rounded-[2.5rem] border border-border-light shadow-sm"></div>
        <div className="h-64 bg-white rounded-[2.5rem] border border-border-light shadow-sm"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="h-48 bg-white rounded-[2rem] border border-border-light shadow-sm"></div>
          <div className="h-48 bg-white rounded-[2rem] border border-border-light shadow-sm"></div>
          <div className="h-48 bg-white rounded-[2rem] border border-border-light shadow-sm"></div>
        </div>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen bg-bg-surface flex items-center justify-center">
      <div className="text-center space-y-5 bg-white p-12 rounded-[2.5rem] border border-border-light shadow-sm">
        <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <svg className="w-12 h-12 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-carbon-black tracking-tight">Record Not Found</h2>
          <p className="text-base font-medium text-slate-500">The item you are looking for doesn't exist or has been removed.</p>
        </div>
        <button onClick={() => window.history.back()} className="mt-4 px-6 py-3 bg-slate-50 hover:bg-slate-100 text-carbon-gray font-bold rounded-2xl transition-all border border-border-light shadow-sm">
          Go Back
        </button>
      </div>
    </div>
  );
}