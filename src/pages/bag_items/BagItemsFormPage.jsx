import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DynamicForm from "../../components/components/BaseComponents/DynamicForm";
import { createItem, getOne, updateItem } from "../../service/services/apiService";
import { buildPayloadByEndpoint } from "../../utils/payloadBuilders";
import { bagItemsEndpoint, bagItemsFields } from "./config";

export default function BagItemsFormPage({ mode = "create" }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(mode === "edit");

  useEffect(() => {
    if (mode !== "edit" || !id) return;
    setLoading(true);
    getOne(bagItemsEndpoint, id)
      .then((res) => setInitialData(res.data || res))
      .finally(() => setLoading(false));
  }, [id, mode]);

  const handleSubmit = async (formData) => {
    try {
      const payload = buildPayloadByEndpoint(bagItemsEndpoint, formData);
      if (mode === "edit") await updateItem(bagItemsEndpoint, id, payload);
      else await createItem(bagItemsEndpoint, payload);
      navigate("/bag_items");
      return { success: true };
    } catch (error) {
      return { success: false, errors: error.response?.data?.errors || {} };
    }
  };

  const visibleFields = bagItemsFields.filter((f) => f.form_show !== false && !["id", "created_at", "updated_at"].includes(f.key));

  if (loading) return <div className="p-10">Loading...</div>;
  return (
    <div className="max-w-6xl mx-auto p-6">
      <DynamicForm fields={visibleFields} initialData={initialData} onSubmit={handleSubmit} mode={mode} />
    </div>
  );
}
