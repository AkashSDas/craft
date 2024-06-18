import { getAuthorProfile } from "@app/services/user";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

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

export function useGetAuthorPageProfile() {
    const router = useRouter();
    const data = useGetAuthor(router.query.authorId as string);

    return data;
}
