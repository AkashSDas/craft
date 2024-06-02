import { createArticle, getArticle } from "@app/services/articles";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useUser } from "./auth";
import { useEffect } from "react";
import { useAppDispatch } from "./store";
import { populateEditor } from "@app/store/editor/slice";

/**
 * This hook should be used only once and i.e. inside the Edit Article page.
 * This is because it fetches the article data and populates the editor with it.
 * If fetched everywhere then it'll overwrite the editor data.
 *
 * But this is mitigated by using a flag in Redux store, so this hook can be used
 * anywhere and it'll only populate the editor if the flag is false.
 */
export function useEditArticle() {
    const { isLoggedIn, user } = useUser();
    const router = useRouter();
    const { data, isError, isLoading, error } = useQuery({
        queryKey: ["article", user?.userId, router.query.articleId],
        queryFn: () => getArticle(router.query.articleId as string),
        enabled: isLoggedIn && router.query.articleId !== undefined,
        staleTime: 1000 * 60 * 5,
    });
    const dispatch = useAppDispatch();

    useEffect(function update() {
        if (data?.article) {
            dispatch(
                populateEditor({
                    blockIds: data.article.blockIds,
                    blocks: data.article.blocks,
                })
            );
        }
    }, []);

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
