import { Article } from "@app/services/articles";

export function articleStub(): Article {
    return {
        articleId: "articleId",
        authorIds: [
            {
                userId: "userId",
                username: "AkashSDas",
                profilePic: {
                    id: "profilePic",
                    URL: "https://example.com/image.png",
                },
            },
        ],
        headline: "headline",
        description: "description",
        coverImage: {
            id: "coverImage",
            URL: "https://example.com/image.png",
        },
        lastUpdatedAt: "lastUpdatedAt",
        readTimeInMs: 10,
        blocks: {
            block1: {
                blockId: "block1",
                type: "paragraph",
                value: {
                    text: "Hello World",
                },
            },
        },
        isPublic: true,
        blockIds: ["block1"],
        topics: ["topic1", "topic2"],
    };
}
