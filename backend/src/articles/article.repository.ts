import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Article } from "./schema";
import { FilterQuery, Model, Types } from "mongoose";

@Injectable({})
export class ArticleRepository {
    constructor(@InjectModel(Article.name) private model: Model<Article>) {}

    /** Initialize an article by an author. */
    async initArticle(authorId: Types.ObjectId) {
        const res = await this.model.create({
            authorIds: [authorId],
            lastUpdatedAt: new Date(),
        });

        return this.model
            .findOne({ _id: res._id })
            .populate("authorIds", "username profilePic userId");
    }

    async exists(articleId: string) {
        return await this.model.exists({ articleId });
    }

    async checkArticleExists(authorId: Types.ObjectId, articleId: string) {
        return await this.model.findOne(
            { articleId, authorIds: authorId },
            { authorIds: 1 },
        );
    }

    async getArticleById(articleId: string, removeBlocksText: boolean = true) {
        if (removeBlocksText) {
            return await this.model
                .findOne({ articleId })
                .select({ blocksText: 0 })
                .populate("authorIds", "username profilePic userId");
        }

        return await this.model
            .findOne({ articleId })
            .populate("authorIds", "username profilePic userId");
    }

    async updateOne(articleId: string, update: Partial<Article>) {
        return await this.model.updateOne(
            { articleId },
            { $set: update },
            { runValidators: true },
        );
    }

    async getUserPublishedArticles(authorId: Types.ObjectId) {
        return await this.model
            .find({ isPublic: true, authorIds: authorId })
            .populate("authorIds", "username profilePic userId");
    }

    async getUserDraftArticles(authorId: Types.ObjectId) {
        return await this.model
            .find({ isPublic: false, authorIds: authorId })
            .populate("authorIds", "username profilePic userId");
    }

    async getArticles(articleIds: Types.ObjectId[]) {
        return await this.model
            .find({ _id: { $in: articleIds } })
            .populate("authorIds", "username profilePic userId");
    }

    async getArticlesForReadListPreview(articleIds: string[]): Promise<any> {
        return await this.model
            .find({ articleId: { $in: articleIds }, isPublic: true })
            .select(
                "articleId headline description coverImage lastUpdatedAt readTimeInMs blocks",
            )
            .populate("authorIds", "username profilePic userId")
            .then((articles) =>
                articles.map((article) => {
                    const filteredBlocks: typeof article.blocks = new Map();
                    for (const [key, value] of article.blocks.entries()) {
                        if (value.type === "image") {
                            filteredBlocks.set(key, { ...value });
                        }
                    }

                    article.blocks = filteredBlocks;
                    return article;
                }),
            );
    }

    // ===========================================
    // List articles (trending, list)
    // ===========================================

    async getArticlesPaginated(limit: number, offset: number, text?: string) {
        if (typeof text === "string" && text.length > 0) {
            console.log("searching", text, text.toLowerCase());
            const query = {
                $text: { $search: text.toLowerCase() },
                isPublic: true,
            };
            const [articles, totalCount] = await Promise.all([
                this.model
                    .find(query)
                    .skip(offset)
                    .limit(limit)
                    .populate("authorIds", "username profilePic userId")
                    .sort({ lastUpdatedAt: -1 }),
                this.model.countDocuments(query),
            ]);

            return { articles, totalCount };
        }

        const [articles, totalCount] = await Promise.all([
            this.model
                .find({ isPublic: true })
                .skip(offset)
                .limit(limit)
                .populate("authorIds", "username profilePic userId")
                .sort({ lastUpdatedAt: -1 }),

            this.model.countDocuments({ isPublic: true }),
        ]);

        return { articles, totalCount };
    }

    async getTrendingArticles(limit: number) {
        // These are trending articles sorted on the combination of last
        // updated on (more weightage) and article likes.

        return await this.model.aggregate([
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "articleId",
                    as: "likes",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "authorIds",
                    foreignField: "_id",
                    as: "authorIds",
                },
            },
            {
                $addFields: {
                    likeCount: { $size: "$likes" },
                    weight: {
                        $add: [
                            {
                                $multiply: [
                                    {
                                        $toDouble: {
                                            $subtract: [
                                                new Date(),
                                                "$lastUpdatedAt",
                                            ],
                                        },
                                    },
                                    0.5,
                                ],
                            }, // Weight for recency
                            { $multiply: ["$likeCount", 1] }, // Weight for likes
                        ],
                    },
                },
            },
            {
                $project: {
                    articleId: 1,
                    authorIds: {
                        username: 1,
                        profilePic: 1,
                        userId: 1,
                        _id: 1,
                    },
                    blockIds: 1,
                    blocks: 1,
                    coverImage: 1,
                    createdAt: 1,
                    description: 1,
                    headline: 1,
                    isPublic: 1,
                    lastUpdatedAt: 1,
                    likeCount: 1,
                    likes: 1,
                    readTimeInMs: 1,
                    topics: 1,
                    updatedAt: 1,
                    weight: 1,
                    _id: 1,
                },
            },
            { $sort: { weight: -1 } },
            { $limit: limit },
        ]);
    }

    async findOne(filter: FilterQuery<Article>, select?: string) {
        return await this.model.findOne(filter).select(select);
    }

    async deleteOne(filter: FilterQuery<Article>): Promise<any> {
        return await this.model.deleteOne(filter);
    }
}
