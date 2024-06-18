import { AuthorArticlesTabContent } from "@app/components/profile-page/AuthorArticlesTabContent";
import { AuthorProfileLayout } from "@app/components/profile-page/AuthorProfileLayout";
import { useGetAuthorPageProfile } from "@app/hooks/user";

export default function AuthorProfilePage() {
    const { author } = useGetAuthorPageProfile();

    return (
        <AuthorProfileLayout tab="posts" authorId={author?.userId}>
            {author?.userId ? (
                <AuthorArticlesTabContent authorId={author?.userId} />
            ) : null}
        </AuthorProfileLayout>
    );
}
