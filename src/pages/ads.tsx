import { useParams } from "react-router-dom";
import GenericListPage from "../components/components/BaseComponents/FullDynamic/GenericListPage";
import { AdsFields } from "../../src/schemas/adsSchema"; 
export default function BlogsPage() {
  const { type, mode } = useParams(); 
  const isCreate = mode === "create";

 



  return (
    
    <GenericListPage
      endpoint="ads"
      params={{ type }}  
      headers={AdsFields}
      title={`All ${type}s`}
      
    />

  );
}
