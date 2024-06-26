import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { View } from "./schema";
import { FilterQuery, Model, Types, UpdateQuery } from "mongoose";

@Injectable()
export class ViewsRepsitory {
    constructor(@InjectModel(View.name) private model: Model<View>) {}

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
                    totalReadTime: { $sum: "$readTimeInMs" },
                },
            },
            {
                $project: {
                    date: "$_id",
                    totalViews: 1,
                    totalReadTime: 1,
                },
            },
            {
                $sort: { date: 1 },
            },
        ]);

        return results;
    }
}
