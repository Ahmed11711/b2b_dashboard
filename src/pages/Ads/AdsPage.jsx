import { useTranslation } from "react-i18next";
import GenericListPage from "../../components/components/BaseComponents/FullDynamic/GenericListPage";
import { AdsFields } from "../../schemas/AdsSchema";

export default function AdsPage() {
  const { t } = useTranslation();
  return (
    <GenericListPage
      endpoint="Ads"
      headers={AdsFields}
      title={t("pages.ads.title")}
    />
  );
}