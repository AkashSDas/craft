import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { View } from "./schema";
import { FilterQuery, Model, Types, UpdateQuery } from "mongoose";
import { LifetimeViewsQuery } from "./query";
import { ArticleService } from "src/articles/article.service";
import { ArticleRepository } from "src/articles/article.repository";

@Injectable()
export class ViewsRepsitory {
    constructor(
        @InjectModel(View.name) private model: Model<View>,
        private articleRepo: ArticleRepository,
    ) {}

    async create(view: Partial<View>) {
        return await this.model.create(view);
    }

    async findOne(filter: FilterQuery<View>, select?: string) {
        return await this.model.findOne(filter).select(select);
    }

    async updateOne(filter: FilterQuery<View>, update: UpdateQuery<View>) {
        return await this.model.updateOne(filter, update);
    }

    async exsits(filter: FilterQuery<View>) {
        return await this.model.exists(filter);
    }

    async getUserArticlesAggregatedViews(
        userId: Types.ObjectId,
        startTimestampInMs: number,
        endTimestampInMs: number,
    ) {
        const results = await this.model.aggregate([
            {
                $match: {
                    userId: userId,
                    createdAt: {
                        $gte: new Date(startTimestampInMs),
                        $lte: new Date(endTimestampInMs),
                    },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt",
                        },
                    },
                    totalViews: { $sum: 1 },
                    totalReadTimeInMs: { $sum: "$readTimeInMs" },
                    totalReads: {
                        $sum: {
                            $cond: [{ $eq: ["$hasRead", true] }, 1, 0],
                        },
                    },
                },
            },
            {
                $project: {
                    date: "$_id",
                    totalViews: 1,
                    totalReadTimeInMs: 1,
                    totalReads: 1,
                    _id: 0,
                },
            },
            {
                $sort: { date: 1 },
            },
        ]);

        return results;
    }

    async getUserArticlesLifetimeViewsAggregated(
        userId: Types.ObjectId,
        query: LifetimeViewsQuery,
    ) {
        // Get articles list with likes (count), comments (count),
        // total reads, total views, total read time in millisecond for articles
        // and sort them on the basis of query.filterProperty

        const { filterProperty, order } = query;
        let sort: Record<string, 1 | -1> = { "articleInfo.lastUpdatedAt": 1 };

        switch (filterProperty) {
            case "lastUpdatedAt":
                sort = {
                    "articleInfo.lastUpdatedAt": order === "ASC" ? -1 : 1,
                };
            case "readCount":
                sort = { totalReads: order === "ASC" ? 1 : -1 };
            case "viewCount":
                sort = { totalViews: order === "ASC" ? 1 : -1 };
        }

        return this.articleRepo.getUserArticlesLifetimeStats(userId, sort);
    }
}
