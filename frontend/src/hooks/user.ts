import { getAuthorProfile } from "@app/services/user";
import { useQuery } from "@tanstack/react-query";

export function useGetAuthor(authorId?: string | null) {
    const { data, isLoading, error, isError } = useQuery({
        queryKey: ["author", authorId],
        queryFn: () => getAuthorProfile(authorId!),
        enabled: authorId !== null && authorId !== undefined,
    });

    return {
        author: data?.author,
        isLoading,
        error,
        isError,
        notFound: data?.status === 404,
    };
}
