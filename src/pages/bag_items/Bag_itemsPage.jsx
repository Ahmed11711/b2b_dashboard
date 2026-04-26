import GenericListPage from "../../components/components/BaseComponents/FullDynamic/GenericListPage";
import { Bag_itemsFields } from "../../schemas/bag_itemsSchema";

export default function Bag_itemsPage() {
  return (
    <GenericListPage
      endpoint="bag_items"
      headers={Bag_itemsFields}
      title="pages.bag_items.title"
      addRecordText="pages.bag_items.add_new"
    />
  );
}