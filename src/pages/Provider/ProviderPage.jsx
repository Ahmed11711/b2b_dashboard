import GenericListPage from "../../components/components/BaseComponents/FullDynamic/GenericListPage";
import { ProviderFields } from "../../schemas/ProviderSchema";

export default function ProviderPage() {
  return (
    <GenericListPage
      endpoint="provider"
      headers={ProviderFields}
      title={"All Provider"}
    />
  );
}
