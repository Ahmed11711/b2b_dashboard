import GenericListPage from "../../components/components/BaseComponents/FullDynamic/GenericListPage";
import { AppFields } from "../../schemas/appSchema";

export default function AppPage() {
  return (
    <GenericListPage
      endpoint="app"
      headers={AppFields}
      title={"All app"}
    />
  );
}