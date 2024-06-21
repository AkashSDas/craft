import { getTrendingArticles } from "@app/services/articles";
import { useQuery } from "@tanstack/react-query";

export function useGetTrendingArticles() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["trendingArticles"],
        queryFn: getTrendingArticles,
        staleTime: 1000 * 60 * 30, // 30mins,
    });

    return { articles: data?.articles ?? [], isLoading, isError };
}
