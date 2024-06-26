import { endpoints, fetchFromAPI } from "@app/lib/api";
import { z } from "zod";
import { ImageSchema } from "./articles";

// ==================================
// Validators
// ==================================

const CommentSchema = z.object({
    _id: z.string(),
    text: z.string(),
    authorId: z.object({
        userId: z.string(),
        username: z.string(),
        profilePic: ImageSchema,
    }),
    articleId: z.string(),
    updatedAt: z.string(),
    createdAt: z.string(),
});

const GetCommentsSchema = z.array(
    z.object({
        _id: z.string(),
        text: z.string(),
        author: z.object({
            userId: z.string(),
            username: z.string(),
            profilePic: ImageSchema,
        }),
        updatedAt: z.string(),
        createdAt: z.string(),
    })
);

export type Comment = z.infer<typeof CommentSchema>;
export type GetComment = z.infer<typeof GetCommentsSchema>;

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
        return { success: true, message: data.message, comment };
    } else if (status === 400 && data !== null && "message" in data) {
        return { success: false, message: data.message };
    }

    return {
        success: false,
        message: res.error?.message ?? "Unknown error",
    };
}

export async function getCommentsForArticle(articleId: string) {
    type SuccessResponse = { message: string; comments: any };
    type ErrorResponse = { message: string };

    const res = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.getComments,
        { method: "GET", params: { articleId } }
    );
    const { data, status } = res;

    if (status === 200 && data !== null && "comments" in data) {
        const comments = GetCommentsSchema.parse(data.comments);
        return { success: true, message: data.message, comments };
    } else if (status === 400 && data !== null && "message" in data) {
        return { success: false, message: data.message };
    }

    return {
        success: false,
        message: res.error?.message ?? "Unknown error",
    };
}

export async function deleteComment(commentId: string) {
    type SuccessResponse = { message: string };
    type ErrorResponse = { message: string };

    const res = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.deleteComment(commentId),
        { method: "DELETE" },
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

export async function reportComment(commentId: string) {
    type SuccessResponse = { message: string };
    type ErrorResponse = { message: string };

    const res = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.reportComment(commentId),
        { method: "POST" },
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
