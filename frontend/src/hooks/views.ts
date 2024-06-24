import { useMutation } from "@tanstack/react-query";
import { useUser } from "./auth";
import { endpoints, fetchFromAPI } from "@app/lib/api";
import { useEffect } from "react";
import { useRouter } from "next/router";

export function useRecordReadTimeInArticlePg() {
    const { isLoggedIn } = useUser();
    const router = useRouter();
    const { addViewForArticle, updateReadTimeForArticle } = useViewsManager();

    useEffect(
        function recordReadTime() {
            const startTime = new Date();

            function handleUnload() {
                if (!isLoggedIn) return;
                const endTime = new Date();
                const readTimeInMs = endTime.getTime() - startTime.getTime();
                updateReadTimeForArticle({
                    articleId: router.query.articleId as string,
                    readTimeInMs,
                });
            }

            if (router.query.articleId && router.isReady && isLoggedIn) {
                addViewForArticle({
                    articleId: router.query.articleId as string,
                });
                window.addEventListener("beforeunload", handleUnload);
            }

            return () => {
                window.removeEventListener("beforeunload", handleUnload);
                handleUnload();
            };
        },
        [router.isReady, router.query.articleId, isLoggedIn]
    );
}

export function useViewsManager() {
    const { isLoggedIn } = useUser();

    const { mutateAsync: addViewForArticle } = useMutation({
        async mutationFn({ articleId }: { articleId: string }) {
            if (!isLoggedIn) return;
            await fetchFromAPI(
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
            await fetchFromAPI(
                endpoints.updateReadTimeForArticle,
                { method: "PUT", data: { articleId, readTimeInMs } },
                true
            );
        },
    });

    return { addViewForArticle, updateReadTimeForArticle };
}
