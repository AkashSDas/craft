import { z } from "zod";
import { BlockSchema, ImageSchema } from "./articles";
import { endpoints, fetchFromAPI } from "@app/lib/api";
import { ReadingListInputsType } from "@app/components/reading-lists/ReadingListInput";
import { UpdateReadingListInputsType } from "@app/components/reading-lists/ReadingListUpdateInput";

// ==================================
// Validators
// ==================================

const CreateReadingListResponseSchema = z.object({
    message: z.string(),
    readingList: z.object({
        _id: z.string(),
        name: z.string(),
        isPrivate: z.boolean(),
        userId: z.string(),
        articleIds: z.array(z.string()),
    }),
});

const ReadingListSchema = z.object({
    _id: z.string(),
    name: z.string(),
    isPrivate: z.boolean(),
    isReadLater: z.boolean(),
    userId: z.object({
        userId: z.string(),
        username: z.string(),
        profilePic: ImageSchema,
    }),
    articleIds: z.array(z.string()),
    createdAt: z.string(),
});

const GetReadingListsResponseSchema = z.object({
    message: z.string(),
    readingLists: z.array(ReadingListSchema),
});

const GetReadingListResponseSchema = z.object({
    message: z.string(),
    readingList: z.object({
        _id: z.string(),
        name: z.string(),
        isPrivate: z.boolean(),
        isReadLater: z.boolean(),
        userId: z.object({
            userId: z.string(),
            username: z.string(),
            profilePic: ImageSchema,
        }),
        createdAt: z.string(),
        articleIds: z.array(z.string()),
    }),
});

const ArticlePreviewSchema = z.object({
    _id: z.string(),
    articleId: z.string(),
    headline: z.string().optional(),
    description: z.string().optional(),
    coverImage: ImageSchema.optional(),
    authorIds: z.array(
        z.object({
            userId: z.string(),
            username: z.string(),
            profilePic: ImageSchema.optional(),
        })
    ),
    blocks: z.record(z.string(), BlockSchema),
    readTimeInMs: z.number().min(0),
    lastUpdatedAt: z.string(),
});

const LikesSchema = z.record(z.string(), z.number());

export type CreateReadingListResponse = z.infer<
    typeof CreateReadingListResponseSchema
>;
type GetReadingListsResponse = z.infer<typeof GetReadingListsResponseSchema>;
export type ReadingListType = z.infer<typeof ReadingListSchema>;
export type GetReadingListResponse = z.infer<
    typeof GetReadingListResponseSchema
>;
export type ArticlePreview = z.infer<typeof ArticlePreviewSchema>;

// ==================================
// Services
// ==================================

export async function createReadingList(payload: ReadingListInputsType) {
    type SuccessResponse = CreateReadingListResponse;
    type ErrorResponse = { message: string };

    const res = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.createReadingList,
        { method: "POST", data: { ...payload } },
        true
    );
    const { data, status } = res;

    if (status === 201 && data !== null && "readingList" in data) {
        const parsed = await CreateReadingListResponseSchema.parseAsync(data);
        return {
            success: true,
            message: data.message,
            readingList: parsed.readingList,
        };
    } else if (status === 400 && data !== null && "message" in data) {
        return { success: false, message: data.message };
    }

    return {
        success: false,
        message: res.error?.message ?? "Unknown error",
    };
}

export async function getReadingLists() {
    type SuccessResponse = GetReadingListsResponse;
    type ErrorResponse = { message: string };

    const res = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.createReadingList,
        { method: "GET" },
        true
    );
    const { data, status } = res;

    if (status === 200 && data !== null && "readingLists" in data) {
        const parsed = await GetReadingListsResponseSchema.parseAsync(data);

        // move isReadLater to the start of the array
        const readingLists = parsed.readingLists.sort((a, b) => {
            if (a.isReadLater) return -1;
            if (b.isReadLater) return 1;
            return 0;
        });

        return {
            success: true,
            message: data.message,
            readingLists,
        };
    } else if (status === 400 && data !== null && "message" in data) {
        return { success: false, message: data.message };
    }

    return {
        success: false,
        message: res.error?.message ?? "Unknown error",
    };
}

export async function addArticleReadingLists(
    articleId: string,
    readingListIds: string[]
) {
    type SuccessResponse = { message: string };
    type ErrorResponse = { message: string };

    const res = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.addArticleToReadingLists,
        { method: "PUT", data: { articleId, readingListIds } },
        true
    );
    const { data, status } = res;

    if (status === 200 && data !== null && "message" in data) {
        return { success: true, message: data.message };
    } else if (status === 400 && data !== null && "message" in data) {
        return { success: false, message: data.message };
    }

    return {
        success: false,
        message: res.error?.message ?? "Unknown error",
    };
}

export async function getReadingList(
    readingListId: string,
    userId: string | null = null
) {
    type SuccessResponse = {
        message: string;
        readingList: ReadingListType;
        articles: ArticlePreview[];
        likes: z.infer<typeof LikesSchema>;
    };
    type ErrorResponse = { message: string };

    const res = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.getReadingList(readingListId),
        { method: "GET", params: { userId } },
        true
    );
    const { data, status } = res;

    if (status === 200 && data !== null && "readingList" in data) {
        const [readingList, articles, likes] = await Promise.all([
            ReadingListSchema.parseAsync(data.readingList),
            await Promise.all(
                data.articles.map(async (article) => {
                    return ArticlePreviewSchema.parseAsync(article);
                })
            ),
            await LikesSchema.parseAsync(data.likes),
        ]);

        return {
            success: true,
            message: data.message,
            readingList,
            articles,
            likes,
        };
    } else if (status === 400 && data !== null && "message" in data) {
        return { success: false, message: data.message };
    }

    return {
        success: false,
        message: res.error?.message ?? "Unknown error",
    };
}

export async function deleteReadingList(listId: string) {
    type SuccessResponse = { message: string };
    type ErrorResponse = { message: string };

    const res = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.deleteReadingList(listId),
        { method: "DELETE" },
        true
    );
    const { data, status } = res;

    if (status === 200 && data !== null && "message" in data) {
        return { success: true, message: data.message };
    } else if (status === 400 && data !== null && "message" in data) {
        return { success: false, message: data.message };
    }

    return {
        success: false,
        message: res.error?.message ?? "Unknown error",
    };
}

export async function updateReadingList(
    listId: string,
    payload: UpdateReadingListInputsType
) {
    type SuccessResponse = { message: string };
    type ErrorResponse = { message: string };

    const res = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.updateReadingList(listId),
        { method: "PUT", data: payload },
        true
    );
    const { data, status } = res;

    if (status === 200 && data !== null && "message" in data) {
        return { success: true, message: data.message };
    } else if (status === 400 && data !== null && "message" in data) {
        return { success: false, message: data.message };
    }

    return {
        success: false,
        message: res.error?.message ?? "Unknown error",
    };
}

export async function getAuthorReadingLists(authorId: string) {
    type SuccessResponse = GetReadingListsResponse;
    type ErrorResponse = { message: string };

    const res = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.getAuthorReadingLists(authorId),
        { method: "GET" }
    );
    const { data, status } = res;

    if (status === 200 && data !== null && "readingLists" in data) {
        const parsed = await GetReadingListsResponseSchema.parseAsync(data);

        return {
            success: true,
            message: data.message,
            readingLists: parsed.readingLists,
        };
    } else if (status === 400 && data !== null && "message" in data) {
        return { success: false, message: data.message };
    }

    return {
        success: false,
        message: res.error?.message ?? "Unknown error",
    };
}
