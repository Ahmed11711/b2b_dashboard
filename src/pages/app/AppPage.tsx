import { useTranslation } from "react-i18next";
import GenericListPage from "../../components/components/BaseComponents/FullDynamic/GenericListPage";
import { AppFields } from "../../schemas/appSchema";

export default function AppPage() {
  const { t } = useTranslation();
  return (
    <GenericListPage
      endpoint="app"
      headers={AppFields}
      title={t("sidebar.app")}
    />
  );
}