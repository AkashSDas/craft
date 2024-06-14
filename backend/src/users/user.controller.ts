import { Controller, Get, Param } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller("articles")
export class UserController {
    constructor(private serv: UserService) {}

    @Get("authors/:authorId")
    getAuthorProfile(@Param("authorId") authorId: string) {
        return this.serv.getAuthorProfile(authorId);
    }
}
