import { z } from "zod";
import { ImageSchema } from "./articles";
import { endpoints, fetchFromAPI } from "@app/lib/api";

const AuthorSchema = z.object({
    userId: z.string(),
    username: z.string(),
    profilePic: ImageSchema.optional(),
});

type Author = z.infer<typeof AuthorSchema>;

export async function getAuthorProfile(authorId: string) {
    type SuccessResponse = { author: Author };
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
