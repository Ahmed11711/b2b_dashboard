import { useTranslation } from "react-i18next";
import GenericListPage from "../../components/components/BaseComponents/FullDynamic/GenericListPage";
import { BagsItemsFields } from "../../schemas/BagsItemsSchema";

export default function BagsItemsPage() {
  const { t } = useTranslation();
  return (
    <GenericListPage
      endpoint="bag_items"
      headers={BagsItemsFields}
      title={t("pages.bag_items.title")}
    />
  );
}