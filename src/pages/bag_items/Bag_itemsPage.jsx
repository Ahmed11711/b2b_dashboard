import GenericListPage from "../../components/components/BaseComponents/FullDynamic/GenericListPage";
import { Bag_itemsFields } from "../../schemas/bag_itemsSchema";

export default function Bag_itemsPage() {
  return (
    <GenericListPage
      endpoint="bag_items"
      headers={Bag_itemsFields}
      title={"All bag_items"}
    />
  );
}