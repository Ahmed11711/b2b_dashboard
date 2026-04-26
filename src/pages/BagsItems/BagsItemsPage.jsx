import GenericListPage from "../../components/components/BaseComponents/FullDynamic/GenericListPage";
import { BagsItemsFields } from "../../schemas/BagsItemsSchema";

export default function BagsItemsPage() {
  return (
    <GenericListPage
      endpoint="bag_items"
      headers={BagsItemsFields}
      title="pages.bag_items.title"
      addRecordText="pages.bag_items.add_new"
    />
  );
}