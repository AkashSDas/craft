import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { FollowersService } from "src/followers/followers.service";

@Injectable()
export class UserService {
    constructor(
        @Inject(forwardRef(() => FollowersService))
        private followersService: FollowersService,
        private repo: UserRepository,
    ) {}

    async getAuthorProfile(authorId: string) {
        const author = await this.repo.findOne({ userId: authorId });
        let followersCount = 0;

        if (author) {
            followersCount = await this.followersService.getFollowersCount(
                author._id,
            );
        }

        return { author, followersCount };
    }

    async getRisingAuthors(limit: number) {
        const authors = await this.repo.findRisingAuthors(limit);
        return authors;
    }

    async checkUserExists(userId: string) {
        return await this.repo.exists({ userId });
    }
}
