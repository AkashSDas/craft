import { getCommentsForArticle } from "@app/services/comments";
import { useQuery } from "@tanstack/react-query";

export function useCommentsManager(articleId: string) {
    const commentsQuery = useQuery({
        queryKey: ["comments", articleId],
        queryFn: () => getCommentsForArticle(articleId),
        staleTime: 1000 * 60 * 5, // 5 minutes
        throwOnError: true,
    });

    return { commentsQuery };
}
