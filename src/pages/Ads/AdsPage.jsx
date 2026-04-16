import GenericListPage from "../../components/components/BaseComponents/FullDynamic/GenericListPage";
import { AdsFields } from "../../schemas/AdsSchema";

export default function AdsPage() {
  return (
    <GenericListPage
      endpoint="Ads"
      headers={AdsFields}
      title={"All Ads"}
    />
  );
}