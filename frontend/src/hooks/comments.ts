import {
    deleteComment,
    getCommentsForArticle,
    reportComment,
} from "@app/services/comments";
import { useToast } from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useCommentsManager(articleId: string) {
    const toast = useToast();

    const commentsQuery = useQuery({
        queryKey: ["comments", articleId],
        queryFn: () => getCommentsForArticle(articleId),
        staleTime: 1000 * 60 * 5, // 5 minutes
        throwOnError: true,
    });

    const deleteCommentMutation = useMutation({
        mutationFn: (commentId: string) => deleteComment(commentId),
        onSuccess: () => {
            commentsQuery.refetch();
            toast({
                title: "Comment deleted",
                status: "success",
                duration: 3000,
            });
        },
        onError(error, variables, context) {
            toast({
                title: "Failed to delete comment",
                status: "error",
                duration: 3000,
            });
        },
    });

    const reportCommentMutation = useMutation({
        mutationFn: (commentId: string) => reportComment(commentId),
        onSuccess(data, variables, context) {
            const { message, success } = data;
            if (success) {
                toast({
                    title: "Comment reported",
                    status: "success",
                    duration: 3000,
                });
            } else {
                toast({
                    title: message ?? "Failed to report comment",
                    status: "error",
                    duration: 3000,
                });
            }
        },
        onError(error, variables, context) {
            toast({
                title: error.message ?? "Failed to report comment",
                status: "error",
                duration: 3000,
            });
        },
    });

    return { commentsQuery, deleteCommentMutation, reportCommentMutation };
}
