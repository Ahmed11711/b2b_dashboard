import GenericListPage from "../../components/components/BaseComponents/FullDynamic/GenericListPage";
import { UserFields } from "../../schemas/UserSchema";

export default function UserPage() {
  return (
    <GenericListPage
      endpoint="users"
      routePrefix="User"
      headers={UserFields}
      title={"All User"}
    />
  );
}
