import { z } from "zod";
import { ImageSchema } from "./articles";
import { endpoints, fetchFromAPI } from "@app/lib/api";

// ==================================
// Validators
// ==================================

const FollowerUserSchema = z.object({
    userId: z.string(),
    username: z.string(),
    profilePic: ImageSchema,
});

const FollowingsResponseSchema = z.object({
    message: z.string(),
    followings: z.array(FollowerUserSchema),
});

type FollowerUser = z.infer<typeof FollowerUserSchema>;

// ==================================
// Services
// ==================================

export async function followAuthor(authorUserId: string) {
    type SuccessResponse = { message: string };
    type ErrorResponse = { message: string };

    const res = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.followAuthor,
        { method: "POST", data: { followingAuthorId: authorUserId } },
        true
    );
    const { data, status } = res;

    if (status === 201 && data !== null) {
        return { success: true, message: data.message };
    } else if (status === 400 && data !== null && "message" in data) {
        return { success: false, message: data.message };
    }

    return {
        success: false,
        message: res.error?.message ?? "Unknown error",
    };
}

export async function unfollowAuthor(authorUserId: string) {
    type SuccessResponse = { message: string };
    type ErrorResponse = { message: string };

    const res = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.unfollowAuthor,
        { method: "DELETE", data: { followingAuthorId: authorUserId } },
        true
    );
    const { data, status } = res;

    if (status === 204 && data !== null) {
        return { success: true, message: data.message };
    } else if (status === 400 && data !== null && "message" in data) {
        return { success: false, message: data.message };
    }

    return {
        success: false,
        message: res.error?.message ?? "Unknown error",
    };
}

export async function getFollowings() {
    type SuccessResponse = { message: string; followings: FollowerUser[] };
    type ErrorResponse = { message: string };

    const res = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.getFollowers,
        { method: "GET", params: { type: "followings" } },
        true
    );
    const { data, status } = res;

    if (status === 200 && data !== null) {
        const parsedData = FollowingsResponseSchema.parse(data);
        return {
            success: true,
            message: data.message,
            followings: parsedData.followings,
        };
    } else if (status === 400 && data !== null && "message" in data) {
        return { success: false, message: data.message };
    }

    return {
        success: false,
        message: res.error?.message ?? "Unknown error",
    };
}

export async function getFollowers() {
    type SuccessResponse = { message: string; followers: FollowerUser[] };
    type ErrorResponse = { message: string };

    const res = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.getFollowers,
        { method: "GET", params: { type: "followers" } },
        true
    );
    const { data, status } = res;

    if (status === 200 && data !== null) {
        const parsedData = FollowingsResponseSchema.parse(data);
        return {
            success: true,
            message: data.message,
            followers: parsedData.followings,
        };
    } else if (status === 400 && data !== null && "message" in data) {
        return { success: false, message: data.message };
    }

    return {
        success: false,
        message: res.error?.message ?? "Unknown error",
    };
}
