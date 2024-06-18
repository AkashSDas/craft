import { useGetAuthorArticles } from "@app/hooks/user";
import { Spinner, Text, VStack } from "@chakra-ui/react";
import { ArticlePreviewCard } from "../shared/article-preview-card/ArticlePreviewCard";

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
