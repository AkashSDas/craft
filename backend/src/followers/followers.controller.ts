import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    UseGuards,
} from "@nestjs/common";
import { FollowersService } from "./followers.service";
import { AccessTokenGuard } from "src/auth/guard";
import { IRequest } from "src";
import { FollowAuthorDto } from "./dto";

@Controller("followers")
export class FollowersController {
    constructor(private serv: FollowersService) {}

    @Post("")
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AccessTokenGuard)
    async followAuthor(@Req() req: IRequest, @Body() dto: FollowAuthorDto) {
        await this.serv.followAuthor(req.user._id, dto.followingAuthorId);
        return { message: "You are now following this author" };
    }
}
