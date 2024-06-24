import { useMutation } from "@tanstack/react-query";
import { useUser } from "./auth";
import { endpoints, fetchFromAPI } from "@app/lib/api";

export function useViewsManager() {
    const { isLoggedIn } = useUser();

    const { mutateAsync: addViewForArticle } = useMutation({
        async mutationFn({ articleId }: { articleId: string }) {
            if (!isLoggedIn) return;
            const res = await fetchFromAPI(
                endpoints.addViewForArticle,
                { method: "POST", data: { articleId } },
                true
            );
        },
    });

    const { mutateAsync: updateReadTimeForArticle } = useMutation({
        async mutationFn({
            articleId,
            readTimeInMs,
        }: {
            articleId: string;
            readTimeInMs: number;
        }) {
            if (!isLoggedIn) return;
            const res = await fetchFromAPI(
                endpoints.updateReadTimeForArticle,
                { method: "PUT", data: { articleId, readTimeInMs } },
                true
            );
        },
    });

    return { addViewForArticle, updateReadTimeForArticle };
}
