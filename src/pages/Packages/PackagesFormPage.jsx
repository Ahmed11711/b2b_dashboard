import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DynamicForm from "../../components/components/BaseComponents/DynamicForm";
import { createItem, getOne, updateItem } from "../../service/services/apiService";
import { buildPayloadByEndpoint } from "../../utils/payloadBuilders";
import { packagesEndpoint, packagesFields } from "./config";

export default function PackagesFormPage({ mode = "create" }) {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(mode === "edit");

  useEffect(() => {
    if (mode !== "edit" || !id) return;
    setLoading(true);
    getOne(packagesEndpoint, id)
      .then((res) => setInitialData(res.data || res))
      .finally(() => setLoading(false));
  }, [id, mode]);

  const handleSubmit = async (formData) => {
    try {
      const payload = buildPayloadByEndpoint(packagesEndpoint, formData);
      if (mode === "edit") await updateItem(packagesEndpoint, id, payload);
      else await createItem(packagesEndpoint, payload);
      navigate("/Packages");
      return { success: true };
    } catch (error) {
      return { success: false, errors: error.response?.data?.errors || {} };
    }
  };

  const visibleFields = packagesFields.filter((f) => f.form_show !== false && !["id", "created_at", "updated_at"].includes(f.key));

  if (loading) return <div className="p-10">{t("common.loading")}</div>;
  return (
    <div className="max-w-6xl mx-auto p-6">
      <DynamicForm fields={visibleFields} initialData={initialData} onSubmit={handleSubmit} mode={mode} title={mode === "edit" ? t("pages.packages.edit") : t("pages.packages.add_new")} />
    </div>
  );
}
