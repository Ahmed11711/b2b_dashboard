import GenericListPage from "../../components/components/BaseComponents/FullDynamic/GenericListPage";
import { ServiceFields } from "../../schemas/ServiceSchema";

export default function ServicePage() {
  return (
    <GenericListPage
      endpoint="services"
      headers={ServiceFields}
      title={"All Service"}
      routePrefix="Service"
    />
  );
}
