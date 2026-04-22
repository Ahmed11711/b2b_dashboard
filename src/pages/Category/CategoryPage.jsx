import GenericListPage from "../../components/components/BaseComponents/FullDynamic/GenericListPage";
import { CategoryFields } from "../../schemas/CategorySchema";

export default function CategoryPage() {
  return (
    <GenericListPage
      endpoint="categories"
      headers={CategoryFields}
      title={"All Category"}
    />
  );
}
