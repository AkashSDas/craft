import { Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService {
    constructor(private repo: UserRepository) {}

    async getAuthorProfile(authorId: string) {
        return await this.repo.findOne({ userId: authorId });
    }
}
