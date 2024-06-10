import { endpoints, fetchFromAPI } from "@app/lib/api";
import { z } from "zod";
import { ImageSchema } from "./articles";

// ==================================
// Validators
// ==================================

const CommentSchema = z.object({
    text: z.string(),
    authorId: ImageSchema,
    articleId: z.string(),
});

export type Comment = z.infer<typeof CommentSchema>;

// ==================================
// Services
// ==================================

export async function addComment(articleId: string, text: string) {
    type SuccessResponse = { message: string; comment: Comment };
    type ErrorResponse = { message: string };

    const res = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.addComment,
        { method: "POST", data: { articleId, text } },
        true
    );
    const { data, status } = res;

    if (status === 201 && data !== null && "comment" in data) {
        const comment = CommentSchema.parse(data.comment);
        return { success: true, message: data.message, article: comment };
    } else if (status === 400 && data !== null && "message" in data) {
        return { success: false, message: data.message };
    }

    return {
        success: false,
        message: res.error?.message ?? "Unknown error",
    };
}
