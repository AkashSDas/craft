import {
    BlockId,
    UpdateArticleContentPayload,
    createArticle,
    getArticle,
    makeArticlePublic,
    reorderArticleBlocks,
    updateArticleContent,
    updateArticleFiles,
} from "@app/services/articles";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useUser } from "./auth";
import { useEffect, useMemo } from "react";
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

    const { mutateAsync: reorderMutateAsync, isPending: reorderIsPending } =
        useMutation({
            async mutationFn(blockIds: string[]) {
                await reorderArticleBlocks(
                    router.query.articleId as string,
                    blockIds
                );
            },
        });

    const { mutateAsync, isPending } = useMutation({
        async mutationFn(payload: UpdateArticleContentPayload) {
            await updateArticleContent(payload);

            // don't upload images that are already saved
            const uploadFileIds = Object.keys(files).filter(
                (blockId) => !blockChanges.savedFileBlockIds.includes(blockId)
            );
            const uploadFiles: Record<string, File> = {};
            for (const blockId of uploadFileIds) {
                uploadFiles[blockId] = files[blockId];
            }

            if (uploadFileIds.length > 0) {
                await updateArticleFiles(
                    router.query.articleId as string,
                    uploadFiles
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

    async function reorder(blockIds: BlockId[]) {
        await reorderMutateAsync(blockIds);
    }

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

    return { save, saveIsPending: isPending, reorder, reorderIsPending };
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

    const isOwner: boolean = useMemo(
        function () {
            const matchingOwner = data?.article?.authorIds.find(
                (author) => author.userId === user?.userId
            );

            return matchingOwner !== undefined;
        },
        [data?.article, user?.userId]
    );

    return {
        article: data?.article,
        message: data?.message,
        isOwner,
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

export function useMakeArticlePublic() {
    const router = useRouter();
    const toast = useToast();

    const mutation = useMutation({
        mutationFn: (articleId: string) => makeArticlePublic(articleId),
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
            if (data.success) {
                router.push(`/articles/${variables}`);
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
