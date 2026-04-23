import GenericListPage from "../../components/components/BaseComponents/FullDynamic/GenericListPage";
import { UserPacakgesFields } from "../../schemas/subscribeSchema";

export default function SubscribePage() {
  return (
    <GenericListPage
      endpoint="user_pacakges"
      headers={UserPacakgesFields}
      title={"All subscribe"}
      routePrefix={"Subscribe"}
    />
  );
}
