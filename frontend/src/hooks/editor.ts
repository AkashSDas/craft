import { createArticle } from "@app/services/articles";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";

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
