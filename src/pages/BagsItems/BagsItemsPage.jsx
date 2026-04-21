import GenericListPage from "../../components/components/BaseComponents/FullDynamic/GenericListPage";
import { BagsItemsFields } from "../../schemas/BagsItemsSchema";

export default function BagsItemsPage() {
  return (
    <GenericListPage
      endpoint="bag_items"
      headers={BagsItemsFields}
      title={"All BagsItems"}
    />
  );
}