import { createArticle, getArticle } from "@app/services/articles";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useUser } from "./auth";

export function useEditArticle() {
    const { isLoggedIn, user } = useUser();
    const router = useRouter();
    const { data, isError, isLoading, error } = useQuery({
        queryKey: ["article", user?.userId, router.query.articleId],
        queryFn: () => getArticle(router.query.articleId as string),
        enabled: isLoggedIn && router.query.articleId !== undefined,
        staleTime: 1000 * 60 * 5,
    });

    return {
        article: data?.article,
        message: data?.message,
        isOwner: (data?.article?.authorIds ?? []).includes(user?._id ?? ""),
        isLoading,
        isError,
        error,
    };
}

export function useCreateArticle() {
    const router = useRouter();
    const toast = useToast();

    const mutation = useMutation({
        mutationFn: createArticle,
        onError(error, variables, context) {
            toast({
                title: "Error",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        },
        onSuccess(data, variables, context) {
            if (data.success && data.article) {
                router.push(`/articles/${data.article.articleId}/edit`);
            } else {
                toast({
                    title: "Error",
                    description: data.message ?? "Unknown error",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        },
    });

    return { mutation };
}
