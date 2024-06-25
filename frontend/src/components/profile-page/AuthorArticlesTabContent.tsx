import { useGetAuthorArticles } from "@app/hooks/user";
import { HStack, Spinner, Text, VStack } from "@chakra-ui/react";
import { ArticlePreviewCard } from "../shared/article-preview-card/ArticlePreviewCard";
import { EmptyHeading } from "../shared/headings/EmptyHeading";

type Props = {
    authorId: string;
};

export function AuthorArticlesTabContent(props: Props) {
    const { authorId } = props;
    const { articles, likes, isError, isLoading } =
        useGetAuthorArticles(authorId);

    if (isLoading) {
        return (
            <VStack w="100%" gap="20px">
                <Spinner size="xl" thickness="3px" mt="calc(70px + 4rem)" />
            </VStack>
        );
    } else if (isError) {
        return (
            <VStack w="100%" gap="20px">
                <Text>There was an error</Text>
            </VStack>
        );
    }

    return (
        <VStack w="100%" gap="20px">
            {articles.length === 0 ? (
                <HStack
                    h={{ base: "200px", sm: "280px" }}
                    w="100%"
                    borderRadius="4px"
                    bgColor="black"
                    justifyContent="center"
                    gap={{ base: "1rem", sm: "2rem" }}
                    flexDirection={{ base: "column", sm: "row" }}
                >
                    <EmptyHeading />
                </HStack>
            ) : null}

            {articles.map((article) => {
                return (
                    <ArticlePreviewCard
                        key={article.articleId}
                        article={article}
                        likeCount={likes[article._id] ?? 0}
                    />
                );
            })}
        </VStack>
    );
}
