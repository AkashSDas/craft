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

export type CreateReadingListResponse = z.infer<
    typeof CreateReadingListResponseSchema
>;

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
