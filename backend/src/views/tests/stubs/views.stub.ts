import { Types } from "mongoose";
import { createId } from "src/utils/ids";

export function viewDocumentStub() {
    return {
        _id: new Types.ObjectId(),
        articleId: new Types.ObjectId(),
        userId: new Types.ObjectId(),
        readTimeInMs: 0,
        hasRead: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0,
    };
}

export function montlyViewStub() {
    const [year, month, day] = new Date()
        .toISOString()
        .split("T")[0]
        .split("-");

    return {
        totalViews: 1,
        totalReadTimeInMs: 18411,
        totalReads: 0,
        date: `${year}-${month}-${day}`,
    };
}

export function lifetimeViewStub() {
    return {
        _id: new Types.ObjectId(),
        headline: "this keyword in JavaScript",
        coverImage: {
            URL: "https://res.cloudinary.com/akashsdas/image/upload/v1719588702/article-images/667ed70f45d0b72f4f723420/e8yuzlb17lrz7aan5hbv.webp",
        },
        lastUpdatedAt: new Date(),
        readTimeInMs: 57600,
        articleId: createId("art"),
        likeCount: 0,
        commentCount: 0,
        totalViews: 2,
        totalReadTimeInMs: 4272,
        totalReads: 0,
    };
}
