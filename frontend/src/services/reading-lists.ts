import { z } from "zod";
import { ImageSchema } from "./articles";
import { endpoints, fetchFromAPI } from "@app/lib/api";
import { ReadingListInputsType } from "@app/components/reading-lists/ReadingListInput";

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

export type CreateReadingListResponse = z.infer<
    typeof CreateReadingListResponseSchema
>;
type GetReadingListsResponse = z.infer<typeof GetReadingListsResponseSchema>;
export type ReadingListType = z.infer<typeof ReadingListSchema>;

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
