import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Follower } from "./schema";
import { FilterQuery, Model } from "mongoose";

// followerId -- the user who is following
// followingId -- the user who is being followed

@Injectable()
export class FollowersRepository {
    constructor(@InjectModel(Follower.name) private model: Model<Follower>) {}

    async createFollower(followerId: string, followingId: string) {
        return await this.model.create({
            followerId,
            followingId,
        });
    }

    async exists(followerId: string, followingId: string) {
        return await this.model.exists({ followerId, followingId });
    }

    async deleteFollower(
        followerId: string,
        followingId: string,
    ): Promise<any> {
        return await this.model.deleteOne({
            followerId,
            followingId,
        });
    }

    async getFollowers(followingId: string) {
        return await this.model
            .find({ followingId })
            .populate("followerId", "username userId profilePic");
    }

    async getFollowing(followerId: string) {
        return await this.model
            .find({ followerId })
            .populate("followingId", "username userId profilePic");
    }

    async count(query: FilterQuery<Follower>) {
        return await this.model.countDocuments(query);
    }
}
