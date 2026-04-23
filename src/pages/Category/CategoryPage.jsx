import { useTranslation } from "react-i18next";
import GenericListPage from "../../components/components/BaseComponents/FullDynamic/GenericListPage";
import { CategoryFields } from "../../schemas/CategorySchema";

export default function CategoryPage() {
  const { t } = useTranslation();
  return (
    <GenericListPage
      endpoint="categories"
      headers={CategoryFields}
      title={"All Category"}
      routePrefix="Category"
    />
  );
}
