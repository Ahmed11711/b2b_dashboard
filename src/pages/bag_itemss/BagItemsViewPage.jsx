import { useTranslation } from "react-i18next";
import GenericViewPage from "../../components/components/BaseComponents/FullDynamic/GenericViewPage";
import { bagItemsEndpoint, bagItemsFields } from "./config";

export default function BagItemsViewPage() {
  const { t } = useTranslation();
  return <GenericViewPage entityName={bagItemsEndpoint} fields={bagItemsFields} title={t("pages.bag_items.details")} />;
}
