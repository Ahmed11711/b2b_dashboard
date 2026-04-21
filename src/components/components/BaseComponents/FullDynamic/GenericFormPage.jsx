import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DynamicForm from "../DynamicForm";
import { getOne, createItem, updateItem } from "../../../../service/services/apiService";
import { buildPayloadByEndpoint } from "../../../../utils/payloadBuilders";

export default function GenericFormPage({ endpoint, fields, title, mode = "create" }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(mode === "edit");

  useEffect(() => {
    if (mode === "edit" && id) {
      setLoading(true);
      getOne(endpoint, id)
        .then((res) => {
          // تأكد إن res هو الأوبجكت المباشر (name, price, etc.)
          const data = res.data || res;
          setInitialData(data);
        })
        .catch((err) => console.error("❌ Fetch Error:", err))
        .finally(() => setLoading(false));
    }
  }, [endpoint, id, mode]);

const handleSubmit = async (formData) => {
  try {
    const dataToSend = buildPayloadByEndpoint(endpoint, formData);

    if (mode === "edit") {
      await updateItem(endpoint, id, dataToSend);
    } else {
      await createItem(endpoint, dataToSend);
    }

    navigate(-1);
  } catch (err) {
    if (err.response?.data?.errors) {
      return { success: false, errors: err.response.data.errors };
    }
  }
};
  if (loading) return (
    <div className="flex justify-center items-center h-64">
       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-solid"></div>
    </div>
  );
  const visibleFields = fields.filter(
    (f) => f.form_show !== false && !['id', 'created_at', 'updated_at'].includes(f.key)
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 animate-in fade-in duration-500">
      
      {/* Header الصفحة */}
      <div className="flex justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 bg-card-bg hover:bg-emerald-tint text-carbon-gray rounded-full transition-all duration-300 shadow-sm border border-border-thin"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-heading-slate tracking-tight capitalize">
            {mode === "edit" ? ` ${title}` : `Create ${title}`}
          </h1>
        </div>
      </div>

      {/* منطقة الفورم */}
      <div className="w-full">
        <DynamicForm 
          fields={visibleFields}  // 👈 بنبعت الحقول المفلترة هنا
          initialData={initialData} // دي أهم قطعة عشان الداتا تظهر
          onSubmit={handleSubmit}
          mode={mode}
        />
      </div>
    </div>
  );
}