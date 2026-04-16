import GenericListPage from "../../components/components/BaseComponents/FullDynamic/GenericListPage";
import { PackagesFields } from "../../schemas/PackagesSchema";

export default function PackagesPage() {
  return (
    <GenericListPage
      endpoint="packages"
      headers={PackagesFields}
      title={"All Packages"}
    />
  );
}