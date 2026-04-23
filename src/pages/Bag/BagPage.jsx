import { useTranslation } from "react-i18next";
import GenericListPage from "../../components/components/BaseComponents/FullDynamic/GenericListPage";
import { BagFields } from "../../schemas/BagSchema";

export default function BagPage() {
  const { t } = useTranslation();
  return (
    <GenericListPage
      endpoint="bags"
      headers={BagFields}
      title={t("pages.bag.title")}
    />
  );
}