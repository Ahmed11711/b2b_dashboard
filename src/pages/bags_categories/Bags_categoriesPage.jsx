import { useTranslation } from "react-i18next";
import GenericListPage from "../../components/components/BaseComponents/FullDynamic/GenericListPage";
import { BagsCategoryFields } from "../../schemas/bags_categoriesSchema";

export default function Bags_categoriesPage() {
  const { t } = useTranslation();
  return (
    <GenericListPage
      endpoint="bags_categories"
      headers={BagsCategoryFields}
      title={t("pages.bags_categories.title")}
    />
  );
}