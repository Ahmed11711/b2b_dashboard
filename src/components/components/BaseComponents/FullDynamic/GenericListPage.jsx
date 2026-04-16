import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TableComponent from "../TableComponent";
import { getAll, deleteItem, createItem } from "../../../../service/services/apiService";
import DynamicForm from "../DynamicForm"; 

// 1. مكون مودل الحذف (كما هو بدون تغيير)
 function DeleteConfirmModal({ isOpen, onConfirm, onCancel, itemName }) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsDeleting(true); // 1. ابدأ التحميل
    try {
      await onConfirm(); // 2. استنى تنفيذ عملية المسح
    } finally {
      setIsDeleting(false); // 3. اقفل التحميل (اختياري لأن المودال هيقفل غالباً)
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full p-10 border border-slate-100 animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center">
          
          {/* Icon مع انيميشن نبض لو في حالة التحميل */}
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 text-red-500 shadow-inner transition-all duration-500 ${isDeleting ? 'bg-red-100 animate-pulse' : 'bg-red-50'}`}>
            {isDeleting ? (
               <svg className="w-12 h-12 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/></svg>
            ) : (
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </div>

          <h3 className="text-2xl font-black text-slate-900 mb-2">Confirm Delete</h3>
          <p className="text-slate-500 mb-8 leading-relaxed">
            {isDeleting ? "Processing your request..." : <>You are about to delete <span className="font-bold text-red-600 underline decoration-2 underline-offset-4 tracking-tight">"{itemName}"</span>. This cannot be undone.</>}
          </p>

          <div className="flex gap-4 w-full">
            <button 
              onClick={onCancel} 
              disabled={isDeleting}
              className="flex-1 px-6 py-4 rounded-2xl border-2 border-slate-100 font-bold text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button 
              onClick={handleConfirm} 
              disabled={isDeleting}
              className={`flex-1 px-6 py-4 rounded-2xl font-black text-white shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2
                ${isDeleting ? 'bg-red-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 shadow-red-200'}
              `}
            >
              {isDeleting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span>Deleting...</span>
                </>
              ) : "Yes, Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. مكون مودل الإنشاء (كما هو بدون تغيير)
function CreateRecordModal({ isOpen, onClose, endpoint, headers, onRefresh, title }) {
  if (!isOpen) return null;
// في handleFormSubmit جوه CreateRecordModal
const handleFormSubmit = async (formData) => {
  try {
    const payload = new FormData();
    
    // ✅ تأكد إن الـ boolean/checkbox بيتبعت حتى لو 0
    headers.forEach(h => {
      if (h.type === "checkbox" || h.type === "boolean") {
        const val = formData[h.key];
        payload.append(h.key, val === undefined ? 0 : val ? 1 : 0);
      }
    });

    Object.keys(formData).forEach((key) => {
      const value = formData[key];
      // تجاهل الـ boolean لأنا عملناهم فوق
      const field = headers.find(h => h.key === key);
      if (field?.type === "checkbox" || field?.type === "boolean") return;
      
      if (value !== null && value !== undefined) {
        payload.append(key, value);
      }
    });

    await createItem(endpoint, payload);
    onRefresh();
    onClose();
    return { success: true };
  } catch (error) {
    if (error.response?.data?.errors) {
      return { success: false, errors: error.response.data.errors };
    }
    return { success: false, message: "Error occurred" };
  }
};

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-100 animate-in zoom-in-95 duration-200 relative scrollbar-hide">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 z-50 p-3 rounded-full bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="p-12">
          <DynamicForm 
            title={`Create New ${title || 'Record'}`}
            fields={headers} 
            onSubmit={handleFormSubmit}
          />
        </div>
      </div>
    </div>
  );
}

 export default function GenericListPage({ endpoint, headers, title, params = {} }) {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });
  const [createModalOpen, setCreateModalOpen] = useState(false);
  
   const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState({});

  const navigate = useNavigate();

const loadData = useCallback(async (page = 1) => {
  setLoading(true);
  try {
    // 1. تجميع كل الـ Parameters
    const rawParams = { 
      ...params, 
      page, 
      search: searchTerm, 
      ...activeFilters 
    };

    // 2. تنظيف الـ Parameters: حذف أي Key قيمته فارغة تماماً
    const cleanParams = Object.fromEntries(
      Object.entries(rawParams).filter(([_, value]) => {
        return value !== "" && value !== null && value !== undefined;
      })
    );

    // 3. مناداة الـ API بالـ Params النظيفة فقط
    const response = await getAll(endpoint, cleanParams);

    if (response) {
      const fetchedData = response.data || (Array.isArray(response) ? response : []);
      setMeta({
        current_page: parseInt(response.meta?.current_page || page),
        last_page: parseInt(response.meta?.last_page || 1),
        total: parseInt(response.meta?.total || fetchedData.length),
        per_page: parseInt(response.meta?.per_page || 10)
      });
      setData(fetchedData);
    }
  } catch (error) {
    console.error("❌ API Error:", error);
  } finally {
    setLoading(false);
  }
}, [endpoint, searchTerm, JSON.stringify(activeFilters), JSON.stringify(params)]);
  // ✅ Debounce البحث لتقليل الـ API Requests
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadData(1);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, activeFilters]);

  const handleFinalDelete = async () => {
    try {
      await deleteItem(endpoint, deleteModal.item.id);
      setDeleteModal({ isOpen: false, item: null });
      loadData(meta.current_page);
    } catch (error) { console.error(error); }
  };
 
  return (
    <div className="page-container antialiased pb-20 bg-[#fbfcfd] min-h-screen">
      <div className="max-w-[1600px] mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center py-10 gap-6">
          <div className="text-center md:text-left">
  <h1 className="text-4xl font-black text-heading-slate tracking-tighter capitalize mb-2">
  {title || endpoint.replace(/-/g, ' ')}
  <span className="block h-1 w-16 bg-emerald-solid mt-2 rounded-full"></span>
</h1>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full">
<span className="w-1.5 h-1.5 rounded-full bg-emerald-solid animate-pulse"></span>
            <span className="text-[11px] font-bold text-emerald-text uppercase tracking-wider">
  Database Online: {meta.total} Objects
</span>
            </div>
          </div>

        <button
  onClick={() => setCreateModalOpen(true)}
  className="group relative overflow-hidden bg-emerald-solid text-white px-10 py-4 rounded-[1.5rem] font-bold flex items-center gap-3 transition-all hover:pr-12 active:scale-95 shadow-2xl shadow-blue-200"
>
  <span>Add New Record</span>

  <svg
    className="w-5 h-5 transition-all group-hover:translate-x-1"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="3"
      d="M12 4v16m8-8H4"
    />
  </svg>
</button>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center z-50 bg-white/60 backdrop-blur-md">
               <div className="w-12 h-12 border-[5px] border-slate-100 border-t-emerald-500 rounded-full animate-spin"></div>
            </div>
          )}

          <TableComponent
            headers={headers}
            data={data}
            meta={meta}
            onPageChange={(page) => loadData(page)}
            onSearchChange={(value) => setSearchTerm(value)} // ✅ للبحث
            onFilterChange={(key, value) => setActiveFilters(prev => ({ ...prev, [key]: value }))} // ✅ للفلترة
            onEdit={(row) => navigate(`/${endpoint}/edit/${row.id}`)}
            onDelete={(row) => setDeleteModal({ isOpen: true, item: row })}
            onView={(row) => navigate(`/${endpoint}/view/${row.id}`)}
          />
        </div>
      </div>

      <DeleteConfirmModal 
        isOpen={deleteModal.isOpen}
        itemName={deleteModal.item?.title || deleteModal.item?.name || `ID: ${deleteModal.item?.id}`}
        onCancel={() => setDeleteModal({ isOpen: false, item: null })}
        onConfirm={handleFinalDelete}
      />

<CreateRecordModal 

  isOpen={createModalOpen}
  onClose={() => setCreateModalOpen(false)}
  endpoint={endpoint}
headers={headers.filter(h => {
  const key = h.key?.toLowerCase();
  const systemFields = ['id', 'created_at', 'updated_at', 'deleted_at'];
  return !systemFields.includes(key) && h.type; 
})}
  title={title}
  onRefresh={() => loadData(1)}
/>
    </div>
  );
}