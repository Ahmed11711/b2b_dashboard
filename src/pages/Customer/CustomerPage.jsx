import { useTranslation } from "react-i18next";
import GenericListPage from "../../components/components/BaseComponents/FullDynamic/GenericListPage";
import { CustomerFields } from "../../schemas/CustomerSchema";

export default function CustomerPage() {
  const { t } = useTranslation();
  return (
    <GenericListPage
      endpoint="customer"
      headers={CustomerFields}
      title={t("pages.customer.title")}
    />
  );
}
