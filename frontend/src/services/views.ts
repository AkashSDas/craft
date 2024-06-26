import { endpoints, fetchFromAPI } from "@app/lib/api";
import { z } from "zod";

// ==================================
// Validators
// ==================================

const GetUserArticlesMonthlyViews = z.object({
    views: z.array(
        z.object({
            data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
            totalReadTimeInMs: z.number().min(0),
            totalViews: z.number().min(0),
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

    if (status === 201 && data !== null && "views" in data) {
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
