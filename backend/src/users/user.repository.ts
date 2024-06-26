import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schema/user.schema";
import {
    Model,
    type FilterQuery,
    type QueryOptions,
    type UpdateQuery,
    type UpdateWithAggregationPipeline,
} from "mongoose";
import { Follower } from "src/followers/schema";

@Injectable({})
export class UserRepository {
    constructor(@InjectModel(User.name) private model: Model<User>) {}

    async create(user: Partial<User>) {
        return await this.model.create(user);
    }

    async findOne(query: FilterQuery<User>, select?: string) {
        return await this.model.findOne(query).select(select);
    }

    async exists(query: FilterQuery<User>) {
        return await this.model.exists(query);
    }

    async updateOne(
        query: FilterQuery<User>,
        update: UpdateWithAggregationPipeline | UpdateQuery<User>,
    ) {
        return await this.model.updateOne(query, update);
    }

    async findOneAndUpdate(
        query: FilterQuery<User>,
        update: UpdateWithAggregationPipeline | UpdateQuery<User>,
        options?: QueryOptions,
    ) {
        return await this.model.findOneAndUpdate(query, update, options);
    }

    async deleteOne(
        query: FilterQuery<User>,
    ): Promise<ReturnType<typeof this.model.deleteOne>> {
        return await this.model.deleteOne(query);
    }

    async findRisingAuthors(limit: number) {
        return await this.model.aggregate([
            {
                $lookup: {
                    from: Follower.name,
                    localField: "_id",
                    foreignField: "followingId",
                    as: "followers",
                },
            },
            {
                $addFields: {
                    followerCount: { $size: "$followers" },
                },
            },
            {
                $project: {
                    username: 1,
                    email: 1,
                    profilePic: 1,
                    followerCount: 1,
                    userId: 1,
                },
            },
            {
                $sort: { followerCount: -1 },
            },
            {
                $limit: limit,
            },
        ]);
    }
}
