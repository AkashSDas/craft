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

        return await this.repo.createFollower(
            followerId.toString(),
            exists._id.toString(),
        );
    }
}
