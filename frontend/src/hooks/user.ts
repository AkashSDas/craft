import { getAuthorArticles } from "@app/services/articles";
import { getAuthorProfile, getTrendingAuthors } from "@app/services/user";
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
        followersCount: data?.followersCount,
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

export function useGetAuthorArticles(authorId?: string | null) {
    const { data, isLoading, error, isError } = useQuery({
        queryKey: ["authorArticles", authorId],
        queryFn: () => getAuthorArticles(authorId!),
        enabled: authorId !== null && authorId !== undefined,
    });

    return {
        articles: data?.articles ?? [],
        likes: data?.likes ?? ({} as Record<string, number>),
        isLoading,
        error,
        isError,
    };
}

export function useGetTrendingAuthors() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["trendingAuthors"],
        queryFn: getTrendingAuthors,
        staleTime: 1000 * 60 * 30, // 30mins,
    });

    return { authors: data?.authors ?? [], isLoading, isError };
}
