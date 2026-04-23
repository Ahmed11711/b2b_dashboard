import { useTranslation } from "react-i18next";
import GenericListPage from "../../components/components/BaseComponents/FullDynamic/GenericListPage";
import { UserFields } from "../../schemas/UserSchema";

export default function UserPage() {
  const { t } = useTranslation();
  return (
    <GenericListPage
      endpoint="users"
      routePrefix="User"
      headers={UserFields}
      title={t("pages.user.title")}
    />
  );
}
