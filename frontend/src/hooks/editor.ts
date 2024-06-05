import {
    UpdateArticleContentPayload,
    createArticle,
    getArticle,
    updateArticleContent,
    updateArticleFiles,
} from "@app/services/articles";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useUser } from "./auth";
import { useEffect } from "react";
import { useAppDispatch } from "./store";
import {
    emptyChanges,
    populateEditor,
    selectBlockChanges,
    selectBlockIds,
    selectBlocks,
    selectFiles,
} from "@app/store/editor/slice";
import { useSelector } from "react-redux";

export function useSaveArticle() {
    const blockIds = useSelector(selectBlockIds);
    const blocks = useSelector(selectBlocks);
    const blockChanges = useSelector(selectBlockChanges);
    const files = useSelector(selectFiles);
    const router = useRouter();
    const dispatch = useAppDispatch();

    const { mutateAsync, isPending } = useMutation({
        async mutationFn(payload: UpdateArticleContentPayload) {
            await updateArticleContent(payload);
            if (Object.keys(files).length > 0) {
                await updateArticleFiles(
                    router.query.articleId as string,
                    files
                );
            }
            dispatch(emptyChanges());
        },
        onError(error, variables, context) {
            console.error(error);
        },
        onSuccess(data, variables, context) {
            console.log(data);
        },
    });

    async function save() {
        const finalAddedBlocks = new Set(
            blockChanges.addedBlocks.filter((blockId) =>
                blockIds.includes(blockId)
            )
        );
        const finalChangedBlocks = new Set(
            blockChanges.changedBlocks
                .filter((blockId) => blockIds.includes(blockId))
                .filter((blockId) => !finalAddedBlocks.has(blockId))
        );

        await mutateAsync({
            articleId: router.query.articleId as string,
            blockIds,
            addedBlockIds: Array.from(finalAddedBlocks),
            changedBlockIds: Array.from(finalChangedBlocks),
            blocks,
        });
    }

    return { save, saveIsPending: isPending };
}

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
        throwOnError: true,
    });
    const dispatch = useAppDispatch();

    useEffect(
        function update() {
            if (data?.article) {
                dispatch(
                    populateEditor({
                        blockIds: data.article.blockIds,
                        blocks: data.article.blocks,
                    })
                );
            }
        },
        [isLoading]
    );

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
