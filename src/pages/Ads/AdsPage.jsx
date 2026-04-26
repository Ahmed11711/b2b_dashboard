import GenericListPage from "../../components/components/BaseComponents/FullDynamic/GenericListPage";
import { AdsFields } from "./../../schemas/adsSchema";

export default function AdsPage() {
  return (
    <GenericListPage endpoint="ads" headers={AdsFields} title={"All Ads"} />
  );
}
