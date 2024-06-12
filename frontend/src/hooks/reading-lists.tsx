import { useMutation, useQuery } from "@tanstack/react-query";
import { useUser } from "./auth";
import {
    addArticleReadingLists,
    getReadingLists,
} from "@app/services/reading-lists";
import { useToast } from "@chakra-ui/react";

export function useReadingListsManager() {
    const { isLoggedIn, user } = useUser();
    const toast = useToast();

    const readingListsQuery = useQuery({
        queryKey: ["readingLists", user?.userId],
        queryFn: getReadingLists,
        enabled: isLoggedIn,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const addArticleToReadingListMutation = useMutation({
        async mutationFn(payload: {
            articleId: string;
            readingListIds: string[];
        }) {
            return await addArticleReadingLists(
                payload.articleId,
                payload.readingListIds
            );
        },
        onSuccess(data, variables, context) {
            if (data.success) {
                toast({
                    title: "Reading lists updated",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                readingListsQuery.refetch();
            } else {
                toast({
                    title: data.message ?? "Unknown error",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        },
    });

    return { readingListsQuery, addArticleToReadingListMutation };
}
