import { endpoints, fetchFromAPI } from "@app/lib/api";
import { z } from "zod";

// ==================================
// Validators
// ==================================

const ImageSchema = z.object({
    id: z.string().optional(),
    URL: z.string(),
});

const ParagraphSchema = z.object({
    blockId: z.string(),
    type: z.literal("paragraph"),
    value: z.object({
        text: z.string(),
    }),
});

const HeadingSchema = z.object({
    blockId: z.string(),
    type: z.literal("heading"),
    value: z.object({
        text: z.string(),
        variant: z.union([z.literal("h1"), z.literal("h2"), z.literal("h3")]),
    }),
});

const DividerSchema = z.object({
    blockId: z.string(),
    type: z.literal("divider"),
    value: z.object({}),
});

const ImageBlockSchema = z.object({
    blockId: z.string(),
    type: z.literal("image"),
    value: ImageSchema.merge(z.object({ caption: z.string().optional() })),
});

const BlockSchema = z.union([
    ParagraphSchema,
    HeadingSchema,
    DividerSchema,
    ImageBlockSchema,
]);

const ArticleSchema = z.object({
    articleId: z.string(),
    authorIds: z.array(z.string()).min(1),
    headline: z.string().optional(),
    description: z.string().optional(),
    coverImage: ImageSchema.optional(),
    topics: z.array(z.string()),
    readTimeInMs: z.number().int().min(0),
    lastUpdatedAt: z.string(),
    blockIds: z.array(z.string()),
    blocks: z.record(z.string(), BlockSchema),
});

export type Paragraph = z.infer<typeof ParagraphSchema>;
export type Heading = z.infer<typeof HeadingSchema>;
export type Divider = z.infer<typeof DividerSchema>;
export type Image = z.infer<typeof ImageBlockSchema>;
export type Block = z.infer<typeof BlockSchema>;
export type BlockId = string;
export type Article = z.infer<typeof ArticleSchema>;

// ==================================
// Services
// ==================================

export async function createArticle() {
    type SuccessResponse = { message: string; article: Article };
    type ErrorResponse = { message: string };

    const res = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.createArticle,
        { method: "POST" },
        true
    );
    const { data, status } = res;

    if (status === 201 && data !== null && "article" in data) {
        const article = ArticleSchema.parse(data.article);
        return { success: true, message: data.message, article: article };
    } else if (status === 400 && data !== null && "message" in data) {
        return { success: false, message: data.message };
    }

    return {
        success: false,
        message: res.error?.message ?? "Unknown error",
    };
}

export async function getArticle(articleId: string) {
    type SuccessResponse = { article: Article };
    type ErrorResponse = { message: string };

    const res = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.getArticle(articleId),
        { method: "GET" }
    );
    const { data, status } = res;

    if (status === 200 && data !== null && "article" in data) {
        const article = ArticleSchema.parse(data.article);
        console.log({ m: article });
        return { success: true, article };
    } else if (status === 404 && data !== null && "message" in data) {
        return { success: false, message: data.message };
    }

    return {
        success: false,
        message: res.error?.message ?? "Unknown error",
    };
}
