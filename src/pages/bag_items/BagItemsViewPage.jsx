import GenericViewPage from "../../components/components/BaseComponents/FullDynamic/GenericViewPage";
import { bagItemsEndpoint, bagItemsFields } from "./config";

export default function BagItemsViewPage() {
  return <GenericViewPage entityName={bagItemsEndpoint} fields={bagItemsFields} title="Bag Item Details" />;
}
