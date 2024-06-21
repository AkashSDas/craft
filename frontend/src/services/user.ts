import { z } from "zod";
import { ImageSchema } from "./articles";
import { endpoints, fetchFromAPI } from "@app/lib/api";

const TRENDING_AUTHORS_LIMIT = 5;

const AuthorSchema = z.object({
    userId: z.string(),
    username: z.string(),
    profilePic: ImageSchema.optional(),
});

const AuthorsSchema = z.array(AuthorSchema);

type Author = z.infer<typeof AuthorSchema>;

export async function getAuthorProfile(authorId: string) {
    type SuccessResponse = { author: Author; followersCount: number };
    type ErrorResponse = { message: string };

    const response = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.getAuthor(authorId),
        { method: "GET" }
    );
    const { data, status } = response;

    if (status === 200 && data !== null && "author" in data) {
        const parsed = await AuthorSchema.parseAsync(data.author);

        return {
            status: 200,
            success: true,
            message: "Retrieved author successfully",
            author: parsed,
            followersCount: data.followersCount,
        };
    } else if (status === 404 && data !== null && "message" in data) {
        return { status: 404, success: false, message: data.message };
    }

    return {
        status: response.error?.status ?? 500,
        success: false,
        message: response.error?.message ?? "Unknown error",
    };
}

export async function getTrendingAuthors() {
    type SuccessResponse = { authors: Author[] };
    type ErrorResponse = { message: string };

    const response = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.getTrendingArticles,
        { method: "GET" }
    );
    const { data, status } = response;

    if (status === 200 && data !== null && "authors" in data) {
        const parsed = await AuthorsSchema.parseAsync(data.authors);

        return { success: true, authors: parsed };
    } else if (status === 400 && data !== null && "message" in data) {
        return { success: false, message: data.message };
    }

    return {
        success: false,
        message: response.error?.message ?? "Unknown error",
    };
}
