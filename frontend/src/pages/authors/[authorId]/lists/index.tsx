import { AuthorProfileLayout } from "@app/components/profile-page/AuthorProfileLayout";
import { AuthorReadingListTabContent } from "@app/components/profile-page/AuthorReadingListTabContent";
import { useGetAuthorPageProfile } from "@app/hooks/user";

export default function AuthorReadingListsPage() {
    const { author } = useGetAuthorPageProfile();

    return (
        <AuthorProfileLayout tab="readingLists" authorId={author?.userId}>
            {author?.userId ? (
                <AuthorReadingListTabContent authorId={author.userId} />
            ) : null}
        </AuthorProfileLayout>
    );
}
