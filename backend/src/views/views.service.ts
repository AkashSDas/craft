import { BadRequestException, Injectable } from "@nestjs/common";
import { ViewsRepsitory } from "./views.repository";
import { Types } from "mongoose";
import { ArticleRepository } from "src/articles/article.repository";
import { LifetimeViewsQuery } from "./query";

@Injectable()
export class ViewsService {
    constructor(
        private repo: ViewsRepsitory,
        private articleRepo: ArticleRepository,
    ) {}

    async addViewForArticle(userId: Types.ObjectId, articleId: Types.ObjectId) {
        const exists = await this.repo.exsits({
            articleId,
            userId,
            updatedAt: {
                $gte: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours
            },
        });
        if (exists) {
            throw new BadRequestException("View already exists");
        }

        const view = await this.repo.create({ articleId, userId });
        return view;
    }

    async updateReadTimeForArticle(
        viewId: string,
        readTimeInMs: number,
        userId: Types.ObjectId,
        articleId: Types.ObjectId,
    ) {
        const view = await this.repo.findOne({
            _id: viewId,
            userId,
            articleId,
        });
        const article = await this.articleRepo.findOne(
            { _id: articleId },
            "readTimeInMs",
        );
        if (!view) {
            throw new BadRequestException("View not found");
        }
        if (!article) {
            throw new BadRequestException("Article not found");
        }

        const viewCreatedAt: Date = (view as any).createdAt;
        const now = new Date().getTime();
        const diff = now - viewCreatedAt.getTime();

        // if diff is less than 3 hours and is more than read time then
        // we're sure that could be a legit view
        if (diff > readTimeInMs && diff < 1000 * 60 * 60 * 3) {
            await this.repo.updateOne(
                { _id: view._id },
                {
                    $set: {
                        readTimeInMs: Math.min(
                            readTimeInMs,
                            article.readTimeInMs * 2,
                        ),
                        hasRead: readTimeInMs > 1000 * 30, // 30 seconds
                    },
                },
            );
        }
    }

    async getUserArticlesMonthlyViewsAggregated(
        userId: Types.ObjectId,
        startTimestampInMs: number,
        endTimestampInMs: number,
    ) {
        const views = await this.repo.getUserArticlesAggregatedViews(
            userId,
            startTimestampInMs,
            endTimestampInMs,
        );
        return views;
    }

    async getUserArticlesLifetimeViewsAggregated(
        userId: Types.ObjectId,
        query: LifetimeViewsQuery,
    ) {
        const views = this.repo.getUserArticlesLifetimeViewsAggregated(
            userId,
            query,
        );

        return views;
    }
}
