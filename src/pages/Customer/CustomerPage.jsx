import GenericListPage from "../../components/components/BaseComponents/FullDynamic/GenericListPage";
import { CustomerFields } from "../../schemas/CustomerSchema";

export default function CustomerPage() {
  return (
    <GenericListPage
      endpoint="customer"
      headers={CustomerFields}
      title={"All Customer"}
    />
  );
}
