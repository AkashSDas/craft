import { endpoints, fetchFromAPI } from "@app/lib/api";
import { z } from "zod";

// ==================================
// Validators
// ==================================

export const ImageSchema = z.object({
    id: z.string().optional(),
    URL: z.string().optional().nullish(),
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
    value: z.object({}).optional(),
});

const ImageBlockSchema = z.object({
    blockId: z.string(),
    type: z.literal("image"),
    value: ImageSchema.merge(
        z.object({ caption: z.string().optional().nullish() })
    ),
});

const QuoteSchema = z.object({
    blockId: z.string(),
    type: z.literal("quote"),
    value: z.object({
        text: z.string(),
    }),
});

export const BlockSchema = z.union([
    ParagraphSchema,
    HeadingSchema,
    DividerSchema,
    ImageBlockSchema,
    QuoteSchema,
]);

export const ArticleSchema = z.object({
    articleId: z.string(),
    authorIds: z
        .array(
            z.object({
                userId: z.string(),
                username: z.string(),
                profilePic: ImageSchema.optional(),
            })
        )
        .min(1),
    headline: z.string().optional(),
    description: z.string().optional(),
    coverImage: ImageSchema.optional(),
    topics: z.array(z.string()),
    readTimeInMs: z.number().int().min(0),
    lastUpdatedAt: z.string(),
    isPublic: z.boolean(),
    blockIds: z.array(z.string()),
    blocks: z.record(z.string(), BlockSchema),
});

const ArticlesSchema = z.array(ArticleSchema);

const LikesSchema = z.record(z.string(), z.number());

export type Paragraph = z.infer<typeof ParagraphSchema>;
export type Heading = z.infer<typeof HeadingSchema>;
export type Divider = z.infer<typeof DividerSchema>;
export type Image = z.infer<typeof ImageBlockSchema>;
export type Quote = z.infer<typeof QuoteSchema>;
export type Block = z.infer<typeof BlockSchema>;
export type BlockId = string;
export type Article = z.infer<typeof ArticleSchema>;

const AuthorArticlesSchema = z.array(
    z.object({ _id: z.string() }).merge(ArticleSchema)
);
export type AuthorArticle = z.infer<typeof AuthorArticlesSchema>[number];

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
    type SuccessResponse = { article: Article; likeCount: number };
    type ErrorResponse = { message: string };

    const res = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.getArticle(articleId),
        { method: "GET" }
    );
    const { data, status } = res;

    if (status === 200 && data !== null && "article" in data) {
        const article = ArticleSchema.parse(data.article);
        return { success: true, article, likeCount: data.likeCount ?? 0 };
    } else if (status === 404 && data !== null && "message" in data) {
        return { success: false, message: data.message };
    }

    return {
        success: false,
        message: res.error?.message ?? "Unknown error",
    };
}

export type UpdateArticleContentPayload = {
    articleId: string;
    blockIds: string[];
    addedBlockIds: string[];
    changedBlockIds: string[];
    blocks: Record<string, Block>;
};

export async function updateArticleContent(
    payload: UpdateArticleContentPayload
) {
    type SuccessResponse = { message: string };
    type ErrorResponse = { message: string };

    const { articleId, blockIds, addedBlockIds, changedBlockIds } = payload;
    const { blocks } = payload;

    const res = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.updateArticleContent(articleId),
        {
            method: "PUT",
            data: { blockIds, addedBlockIds, changedBlockIds, blocks },
            timeout: 60000, // 1 minute
        },
        true
    );
    const { data, status } = res;

    if (status === 200 && data !== null && "message" in data) {
        return { success: true };
    } else if (status === 400 && data !== null && "message" in data) {
        return { success: false, message: data.message };
    }

    return {
        success: false,
        message: res.error?.message ?? "Unknown error",
    };
}

export async function updateArticleFiles(
    articleId: string,
    payload: Record<BlockId, File>
) {
    type SuccessResponse = { message: string };
    type ErrorResponse = { message: string };

    const formData = new FormData();
    Object.entries(payload).forEach(([blockId, file]) => {
        formData.append(blockId, file);
    });

    const res = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.addArticleFiles(articleId),
        { method: "PUT", data: formData },
        true
    );
    const { data, status } = res;

    if (status === 200 && data !== null && "message" in data) {
        return { success: true };
    } else if (status === 400 && data !== null && "message" in data) {
        return { success: false, message: data.message };
    }

    return {
        success: false,
        message: res.error?.message ?? "Unknown error",
    };
}

export async function reorderArticleBlocks(
    articleId: string,
    blockIds: BlockId[]
) {
    type SuccessResponse = { message: string };
    type ErrorResponse = { message: string };

    const res = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.reorderArticleBlocks(articleId),
        { method: "PUT", data: { blockIds } },
        true
    );
    const { data, status } = res;

    if (status === 200 && data !== null && "message" in data) {
        return { success: true };
    } else if (status === 400 && data !== null && "message" in data) {
        return { success: false, message: data.message };
    }

    return {
        success: false,
        message: res.error?.message ?? "Unknown error",
    };
}

export async function getUserArticles(type: "draft" | "public") {
    type SuccessResponse = { articles: Article[] };
    type ErrorResponse = { message: string };

    const res = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.getUserArtilces(type),
        { method: "GET" },
        true
    );
    const { data, status } = res;

    if (status === 200 && data !== null && "articles" in data) {
        const articles = ArticlesSchema.parse(data.articles);
        return { success: true, articles };
    } else if (status === 400 && data !== null && "message" in data) {
        return { success: false, message: data.message };
    }

    return {
        success: false,
        message: res.error?.message ?? "Unknown error",
    };
}

export async function makeArticlePublic(articleId: string) {
    type SuccessResponse = { message: string };
    type ErrorResponse = { message: string };

    const res = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.makeArticlePublic(articleId),
        { method: "PUT" },
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

export async function getAuthorArticles(authorId: string) {
    type SuccessResponse = {
        articles: AuthorArticle[];
        likeCount: z.infer<typeof LikesSchema>;
    };
    type ErrorResponse = { message: string };

    const res = await fetchFromAPI<SuccessResponse | ErrorResponse>(
        endpoints.getAuthorArticles(authorId),
        { method: "GET" }
    );
    const { data, status } = res;

    if (
        status === 200 &&
        data !== null &&
        "articles" in data &&
        "likeCount" in data
    ) {
        const [articles, likes] = await Promise.all([
            AuthorArticlesSchema.parseAsync(data.articles),
            LikesSchema.parseAsync(data.likeCount),
        ]);

        return { success: true, articles, likes };
    } else if (status === 400 && data !== null && "message" in data) {
        return { success: false, message: data.message };
    }
}
