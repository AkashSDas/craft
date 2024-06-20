import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Article } from "./schema";
import { Model, Types } from "mongoose";

@Injectable({})
export class ArticleRepository {
    constructor(@InjectModel(Article.name) private model: Model<Article>) {}

    /** Initialize an article by an author. */
    async initArticle(authorId: Types.ObjectId) {
        return await this.model.create({
            authorIds: [authorId],
            lastUpdatedAt: new Date(),
        });
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

    async getArticleById(articleId: string) {
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
            const query = { $text: { $search: text }, isPublic: true };
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
}
