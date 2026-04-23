import { useTranslation } from "react-i18next";
import GenericListPage from "../../components/components/BaseComponents/FullDynamic/GenericListPage";
import { ProviderFields } from "../../schemas/ProviderSchema";

export default function ProviderPage() {
  const { t } = useTranslation();
  return (
    <GenericListPage
      endpoint="provider"
      headers={ProviderFields}
      title={t("pages.provider.title")}
    />
  );
}
