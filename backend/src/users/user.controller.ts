import { Controller, Get, Param } from "@nestjs/common";
import { UserService } from "./user.service";
import { NotFoundException } from "@nestjs/common";

@Controller("users")
export class UserController {
    constructor(private serv: UserService) {}

    @Get("authors/:authorId")
    async getAuthorProfile(@Param("authorId") authorId: string) {
        const { author, followersCount } =
            await this.serv.getAuthorProfile(authorId);

        if (!author) {
            throw new NotFoundException("Author not found");
        }

        return { author, followersCount };
    }
}