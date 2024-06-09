import { endpoints, fetchFromAPI } from "@app/lib/api";
import { Article, ArticleSchema } from "./articles";

export async function likeOrDislikeArticle(articleId: string) {
    type SuccessResponse = { message: string };
    type ErrorResponse = { message: string };

    const res = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.likeOrDislikeArticle,
        { method: "POST", data: { articleId } },
        true
    );
    const { data, status } = res;

    if (status === 200 && data !== null) {
        return { success: true, message: data.message };
    } else if (status === 400 && data !== null && "message" in data) {
        return { success: false, message: data.message };
    }

    return {
        success: false,
        message: res.error?.message ?? "Unknown error",
    };
}

export async function getLikedArticles() {
    type SuccessResponse = { message: string; articles: Article[] };
    type ErrorResponse = { message: string };

    const res = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.getLikedArticles,
        { method: "GET" },
        true
    );
    const { data, status } = res;

    if (status === 200 && data !== null && "articles" in data) {
        const articles = await Promise.all(
            data.articles.map(async (article) => {
                return ArticleSchema.parseAsync(article);
            })
        );
        return { success: true, message: data.message, articles };
    } else if (status === 400 && data !== null && "message" in data) {
        return { success: false, message: data.message };
    }

    return {
        success: false,
        message: res.error?.message ?? "Unknown error",
    };
}
