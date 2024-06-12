import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "./auth";
import { getLikedArticles, likeOrDislikeArticle } from "@app/services/likes";
import { Article } from "@app/services/articles";

export function useLikesManager() {
    const { isLoggedIn, user } = useUser();
    const queryClient = useQueryClient();

    const likedArticlesQuery = useQuery({
        queryKey: ["likedArticles", user?.userId],
        queryFn: getLikedArticles,
        enabled: isLoggedIn,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    type LikedArticlesData = (typeof likedArticlesQuery)["data"];

    const likeOrDislikeArticleMutation = useMutation({
        mutationFn: (article: Article | Pick<Article, "articleId">) => {
            return likeOrDislikeArticle(article.articleId);
        },
        onMutate(variables) {
            const prev = queryClient.getQueryData([
                "likedArticles",
                user?.userId,
            ]);
            queryClient.setQueryData(
                ["likedArticles", user?.userId],
                (
                    old: LikedArticlesData | undefined
                ): LikedArticlesData | undefined => {
                    if (!old) return old;
                    const exists = old.articles?.find(
                        (art) => art.articleId === variables.articleId
                    );

                    if (exists) {
                        return {
                            ...old,
                            articles:
                                old.articles?.filter((art) => {
                                    return (
                                        art.articleId !== variables.articleId
                                    );
                                }) ?? [],
                        };
                    } else {
                        // check if the variables is the full article object or just an object
                        // with articleId
                        if ((variables as any).blocks !== undefined) {
                            return {
                                ...old,
                                articles: [
                                    ...(old.articles ?? []),
                                    { ...(variables as any) },
                                ],
                            };
                        } else {
                            likedArticlesQuery.refetch();
                        }
                    }
                }
            );
        },
    });

    return { likedArticlesQuery, likeOrDislikeArticleMutation };
}
