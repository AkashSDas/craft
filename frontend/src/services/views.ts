import { endpoints, fetchFromAPI } from "@app/lib/api";
import { z } from "zod";

// ==================================
// Validators
// ==================================

const GetUserArticlesMonthlyViews = z.object({
    views: z.array(
        z.object({
            date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
            totalReadTimeInMs: z.number().min(0),
            totalViews: z.number().min(0),
            totalReads: z.number().min(0),
        })
    ),
});

const GetUserArticlesLifetimeViews = z.object({
    views: z.array(
        z.object({
            commentCount: z.number().min(0),
            coverImage: z.object({ URL: z.string().nullable() }),
            headline: z.string(),
            lastUpdatedAt: z.string(),
            likeCount: z.number().min(0),
            totalReadTimeInMs: z.number().min(0),
            totalReads: z.number().min(0),
            totalViews: z.number().min(0),
            _id: z.string(),
        })
    ),
});

// ==================================
// Services
// ==================================

export async function getUserArticlesMonthlyViews(
    startTimestampInMs: number,
    endTimestampInMs: number
) {
    type SuccessResponse = { message: string; views: any[] };
    type ErrorResponse = { message: string };

    const res = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.getUserArticlesMonthlyViews,
        { method: "GET", params: { startTimestampInMs, endTimestampInMs } },
        true
    );
    const { status, data } = res;

    if (status === 200 && data !== null && "views" in data) {
        const parsed = await GetUserArticlesMonthlyViews.parseAsync(data);
        return { success: true, message: data.message, views: parsed.views };
    } else if (status === 400 && data !== null && "message" in data) {
        return { success: false, message: data.message };
    }

    return {
        success: false,
        message: res.error?.message ?? "Unknown error",
    };
}

export async function getLifetimeAnalytics(filter: string, order: string) {
    type SuccessResponse = { message: string; views: any[] };
    type ErrorResponse = { message: string };

    const res = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.getUserArticlesLifetimeViews,
        { method: "GET", params: { filterProperty: filter, order } },
        true
    );
    const { status, data } = res;

    if (status === 200 && data !== null && "views" in data) {
        const parsed = await GetUserArticlesLifetimeViews.parseAsync(data);
        return { success: true, message: data.message, views: parsed.views };
    } else if (status === 400 && data !== null && "message" in data) {
        return { success: false, message: data.message };
    }

    return {
        success: false,
        message: res.error?.message ?? "Unknown error",
    };
}
