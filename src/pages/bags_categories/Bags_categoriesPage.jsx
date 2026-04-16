import GenericListPage from "../../components/components/BaseComponents/FullDynamic/GenericListPage";
import { BagsCategoryFields } from "../../schemas/bags_categoriesSchema";

export default function Bags_categoriesPage() {
  return (
    <GenericListPage
      endpoint="bags_categories"
      headers={BagsCategoryFields}
      title={"All bags_categories"}
    />
  );
}