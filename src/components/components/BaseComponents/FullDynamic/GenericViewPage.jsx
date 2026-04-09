import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOne } from "../../../../service/services/apiService";

// دالة لجلب القيم المتداخلة
const getValueByPath = (obj, path) => {
  if (!path || !obj) return null;
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), obj);
};

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

  const mainFields = fields.filter(f => f.cell_type !== 'relation');

  const relations = fields
    .filter(f => f.cell_type === 'relation')
    .map(f => {
      const relKey = f.key.replace('_id', '');
      return {
        label: f.label.replace('Id', ''),
        data: data[relKey], 
      };
    })
    .filter(rel => rel.data !== null);

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 md:px-10">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div>
            <h2 className="text-3xl font-black text-slate-900">{title}</h2>
            <p className="text-slate-400 font-medium">Record ID: <span className="text-emerald-600">#{id}</span></p>
          </div>
          <button onClick={() => navigate(-1)} className="px-6 py-3 bg-slate-100 rounded-2xl font-bold hover:bg-slate-200 transition-all">Back</button>
        </div>

        {/* سيكشن البيانات الأساسية */}
        <DataSection title="Main Details" fields={mainFields} data={data} />

        {/* سيكشنز العلاقات الديناميكية */}
        {relations.map((rel, idx) => (
          <div key={idx} className="space-y-6">
             <div className="flex items-center gap-3 ml-6">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
                    <div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
                </div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{rel.label} Details</h3>
             </div>
             
             <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Object.entries(rel.data).map(([dataKey, val]) => {
                    if (typeof val === 'object' || dataKey.includes('_at')) return null;
                    
                    return (
                        <div key={dataKey}>
                            <label className="block text-[11px] font-black uppercase text-slate-400 mb-2">{dataKey.replace('_', ' ')}</label>
                            <div className="bg-slate-50/50 rounded-2xl p-4 border border-transparent hover:border-slate-100 transition-all w-fit min-w-[120px]">
                                {/* لاحظ هنا نمرر dataKey إلى labelKey */}
                                <DynamicValueRenderer value={val} labelKey={dataKey} />
                            </div>
                        </div>
                    );
                })}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ================= Value Renderer Components =================

function ValueRenderer({ field, value }) {
    if (value === null || value === undefined) return <span className="text-slate-300">N/A</span>;
    if (field.type === 'file' || field.type === 'image') {
        return <img src={value} alt="main" className="w-32 h-32 rounded-3xl object-cover border-4 border-white shadow-md" />;
    }
    return <span className="text-slate-700 font-bold">{String(value)}</span>;
}

// --- تم إصلاح الدالة هنا باستقبال labelKey ---
function DynamicValueRenderer({ value, labelKey }) {
    if (value === null || value === undefined) return <span className="text-slate-300">N/A</span>;
    
    const stringValue = String(value);
    const keyName = labelKey ? labelKey.toLowerCase() : "";

    // 1. التخمين الذكي للصور
    const isImageUrl = stringValue.match(/\.(jpeg|jpg|gif|png|webp|svg)$|unsplash\.com/i);
    if (stringValue.startsWith('http') && isImageUrl) {
        return (
            <div className="relative group">
                <img src={stringValue} alt="rel" className="w-24 h-24 rounded-2xl object-cover border-2 border-white shadow hover:scale-105 transition-all duration-300" />
                <a href={stringValue} target="_blank" rel="noreferrer" className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl text-white text-[9px] font-black uppercase">View</a>
            </div>
        );
    }

    // 2. معالجة الـ Boolean والـ Active
    if (keyName.includes('active') || keyName.includes('is_') || value === 0 || value === 1) {
        const isActive = value == 1 || value === true || stringValue === "true";
        return (
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                isActive ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-rose-100 text-rose-700 border-rose-200"
            }`}>
                {isActive ? "Active / Yes" : "Inactive / No"}
            </span>
        );
    }

    // 3. معالجة الـ Status
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

    // 4. معالجة النصوص الطويلة
    if (stringValue.length > 50) {
        return <p className="text-slate-600 text-sm leading-relaxed">{stringValue}</p>;
    }

    return <span className="text-slate-700 font-bold">{stringValue}</span>;
}

function DataSection({ title, fields, data }) {
    return (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-10 py-6 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
                <div className="w-2 h-6 bg-emerald-500 rounded-full"></div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-600">{title}</h3>
            </div>
            <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {fields.map(field => (
                    <div key={field.key} className={field.type === 'textarea' ? 'md:col-span-3' : ''}>
                        <label className="block text-[11px] font-black uppercase text-slate-400 mb-3">{field.label}</label>
                        <div className="bg-slate-50/50 rounded-2xl p-4 border border-transparent hover:border-slate-100 transition-all w-fit">
                             <ValueRenderer field={field} value={data[field.key]} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function LoadingSkeleton() { return <div className="p-20 text-center font-bold animate-pulse text-slate-400">Loading details...</div>; }
function NotFound() { return <div className="p-20 text-center text-red-500 font-bold">Record not found.</div>; }