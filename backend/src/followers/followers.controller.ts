import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Query,
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

    @Delete("")
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(AccessTokenGuard)
    async unfollowAuthor(@Req() req: IRequest, @Body() dto: FollowAuthorDto) {
        await this.serv.unfollowAuthor(req.user._id, dto.followingAuthorId);
    }

    @Get()
    @UseGuards(AccessTokenGuard)
    async getFollowersOrFollowings(
        @Req() req: IRequest,
        @Query("type") type: "followings" | "followers",
    ) {
        switch (type) {
            case "followings":
                return await this.serv.getFollowing(req.user._id);
            case "followers":
                return await this.serv.getFollowers(req.user._id);
            default:
                break;
        }

        throw new BadRequestException("Invalid type");
    }
}
