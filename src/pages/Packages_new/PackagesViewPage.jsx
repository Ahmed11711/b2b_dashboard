import GenericViewPage from "../../components/components/BaseComponents/FullDynamic/GenericViewPage";
import { packagesEndpoint, packagesFields } from "./config";

export default function PackagesViewPage() {
  return <GenericViewPage entityName={packagesEndpoint} fields={packagesFields} title="Package Details" />;
}
