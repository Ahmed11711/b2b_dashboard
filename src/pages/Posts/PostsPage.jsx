import GenericListPage from "../../components/components/BaseComponents/FullDynamic/GenericListPage";
import { PostsFields } from "../../schemas/PostsSchema";

export default function PostsPage() {
  return (
    <GenericListPage
      endpoint="postss"
      headers={PostsFields}
      title={"All Posts"}
      routePrefix="Posts"
    />
  );
}
