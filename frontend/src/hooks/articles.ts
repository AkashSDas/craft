import { queryClient } from "@app/lib/react-query";
import {
    deleteArticle,
    getTrendingArticles,
    getUserArticles,
} from "@app/services/articles";
import { useToast } from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetTrendingArticles() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["trendingArticles"],
        queryFn: getTrendingArticles,
        staleTime: 1000 * 60 * 30, // 30mins,
    });

    return { articles: data?.articles ?? [], isLoading, isError };
}

export function useDeleteArticle() {
    const toast = useToast();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (articleId: string) => deleteArticle(articleId),
        onMutate(variables) {
            const prevDraft = queryClient.getQueryData(["myArticles", "draft"]);
            const prevPublic = queryClient.getQueryData([
                "myArticles",
                "public",
            ]);

            type MyArticles =
                | Awaited<ReturnType<typeof getUserArticles>>
                | undefined;

            if (prevDraft) {
                queryClient.setQueryData(
                    ["myArticles", "draft"],
                    (old: MyArticles): MyArticles => {
                        if (
                            old &&
                            "articles" in old &&
                            Array.isArray(old.articles)
                        ) {
                            return {
                                ...old,
                                articles: old.articles.filter(
                                    (art) => art.articleId !== variables
                                ),
                            };
                        } else {
                            return old;
                        }
                    }
                );
            }

            if (prevPublic) {
                queryClient.setQueryData(
                    ["myArticles", "public"],
                    (old: MyArticles): MyArticles => {
                        if (
                            old &&
                            "articles" in old &&
                            Array.isArray(old.articles)
                        ) {
                            return {
                                ...old,
                                articles: old.articles.filter(
                                    (art) => art.articleId !== variables
                                ),
                            };
                        } else {
                            return old;
                        }
                    }
                );
            }

            toast({
                title: "Success",
                description: "Article deleted successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        },
    });

    return { delete: mutation.mutateAsync, isPending: mutation.isPending };
}
