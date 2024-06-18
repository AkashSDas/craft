import { AuthorProfileLayout } from "@app/components/profile-page/AuthorProfileLayout";
import { AuthorReadingListTabContent } from "@app/components/profile-page/AuthorReadingListTabContent";
import { ReadingListCard } from "@app/components/reading-lists/ReadingListCard";
import { ArticlePreviewCard } from "@app/components/shared/article-preview-card/ArticlePreviewCard";
import {
    useGetAuthorReadingList,
    useGetReadingList,
} from "@app/hooks/reading-lists";
import { useGetAuthorPageProfile } from "@app/hooks/user";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Button, Spinner, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function AuthorReadingListsPage() {
    const { author } = useGetAuthorPageProfile();
    const router = useRouter();
    const { articles, isLoading, isError, likes, readingList } =
        useGetReadingList(router.query.listId as string | undefined);

    return (
        <AuthorProfileLayout tab="readingLists" authorId={author?.userId}>
            {author?.userId ? (
                <>
                    {isLoading ? (
                        <Spinner color="black" thickness="3px" />
                    ) : isError ? (
                        <Text>Something went wrong</Text>
                    ) : (
                        <VStack gap="24px">
                            <Button
                                w="100%"
                                variant="tab"
                                justifyContent="start"
                                fontSize="24px"
                                fontWeight="bold"
                                leftIcon={<ArrowBackIcon />}
                                as={Link}
                                href={`/authors/${author.userId}/lists`}
                            >
                                {readingList?.name}
                            </Button>

                            {articles.map((article) => {
                                const likeCount =
                                    likes[article._id as string] ?? 0;
                                return (
                                    <ArticlePreviewCard
                                        key={article._id}
                                        article={article}
                                        likeCount={likeCount}
                                    />
                                );
                            })}
                        </VStack>
                    )}
                </>
            ) : null}
        </AuthorProfileLayout>
    );
}
