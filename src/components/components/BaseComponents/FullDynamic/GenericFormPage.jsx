import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DynamicForm from "../DynamicForm";
import { getOne, createItem, updateItem } from "../../../../service/services/apiService";

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
    const dataToSend = new FormData();

    // نلف على كل الحقول ونقرر هنبعت إيه
    Object.keys(formData).forEach((key) => {
      const value = formData[key];

      // 1. لو الحقل عبارة عن ملف جديد (File Object) -> نبعته
      if (value instanceof File) {
        dataToSend.append(key, value);
      } 
      // 2. لو الحقل نصي وفيه قيمة (ومش لينك صورة قديمة) -> نبعته
      else if (typeof value !== "string" || !value.startsWith("http")) {
        // بنبعت القيمة لو مش لينك، أو لو كانت Null/Empty (حسب منطق الـ API عندك)
        if (value !== null && value !== undefined) {
          dataToSend.append(key, value);
        }
      }
      // ملحوظة: لو القيمة String وبتبدأ بـ http (يعني صورة قديمة) "بنتجاهلها"
      // لأن لارايفل أوريدي عندها الصورة في الـ DB ومش محتاجة اللينك تاني في الـ Request
    });

    if (mode === "edit") {
      // نستخدم الـ updateItem اللي ظبطناها بالـ _method = PUT
      await updateItem(endpoint, id, dataToSend);
    } else {
      await createItem(endpoint, dataToSend);
    }
    
    navigate(-1);
  } catch (err) {
    // لو الـ API رجعت Validation Errors، اعرضها في الفورم
    if (err.response?.data?.errors) {
      return { success: false, errors: err.response.data.errors };
    }
  }
};
  if (loading) return (
    <div className="flex justify-center items-center h-64">
       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
    </div>
  );
  const visibleFields = fields.filter(
    (f) => f.form_show !== false && !['id', 'created_at', 'updated_at'].includes(f.key)
  );

  return (
    // الـ Container ده هو اللي هيظبط شكل الصفحة ويخليها في النص وبمساحة معقولة
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        
        {/* Header الصفحة */}
        <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">{title}</h1>
            <p className="text-slate-400 text-sm font-medium mt-1">
              {mode === "edit" ? `Modifying item #${id}` : "Fill in the details below"}
            </p>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        {/* منطقة الفورم */}
        <div className="p-8">
          <DynamicForm 
          fields={visibleFields}  // 👈 بنبعت الحقول المفلترة هنا
             initialData={initialData} // دي أهم قطعة عشان الداتا تظهر
            onSubmit={handleSubmit}
            mode={mode}
          />
        </div>

      </div>
    </div>
  );
}