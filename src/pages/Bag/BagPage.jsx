import GenericListPage from "../../components/components/BaseComponents/FullDynamic/GenericListPage";
import { BagFields } from "../../schemas/BagSchema";

export default function BagPage() {
  return (
    <GenericListPage
      endpoint="bags"
      headers={BagFields}
      title={"All Bag"}
    />
  );
}