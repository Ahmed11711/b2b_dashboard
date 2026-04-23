import { useTranslation } from "react-i18next";
import GenericViewPage from "../../components/components/BaseComponents/FullDynamic/GenericViewPage";
import { packagesEndpoint, packagesFields } from "./config";

export default function PackagesViewPage() {
  const { t } = useTranslation();
  return <GenericViewPage entityName={packagesEndpoint} fields={packagesFields} title={t("pages.packages.details")} />;
}
