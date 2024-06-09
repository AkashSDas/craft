import { BadRequestException, Injectable } from "@nestjs/common";
import { FollowersRepository } from "./followers.repository";
import { Types } from "mongoose";
import { UserRepository } from "src/users/user.repository";

@Injectable()
export class FollowersService {
    constructor(
        private repo: FollowersRepository,
        private userRepo: UserRepository,
    ) {}

    /** followerId is following authorId */
    async followAuthor(followerId: Types.ObjectId, authorId: string) {
        const exists = await this.userRepo.exists({ userId: authorId });
        if (!exists) {
            throw new BadRequestException("Author does not exist");
        }

        const isFollowing = await this.repo.exists(
            followerId.toString(),
            exists._id.toString(),
        );
        if (isFollowing) {
            throw new BadRequestException(
                "You are already following this author",
            );
        }

        return await this.repo.createFollower(
            followerId.toString(),
            exists._id.toString(),
        );
    }

    async unfollowAuthor(followerId: Types.ObjectId, authorId: string) {
        const exists = await this.userRepo.exists({ userId: authorId });
        if (!exists) {
            throw new BadRequestException("Author does not exist");
        }

        return await this.repo.deleteFollower(
            followerId.toString(),
            exists._id.toString(),
        );
    }

    async getFollowing(followerId: Types.ObjectId) {
        return await this.repo.getFollowing(followerId.toString());
    }

    async getFollowers(followingId: Types.ObjectId) {
        return await this.repo.getFollowers(followingId.toString());
    }
}
