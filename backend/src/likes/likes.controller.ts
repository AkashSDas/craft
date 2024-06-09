import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    UseGuards,
} from "@nestjs/common";
import { LikesService } from "./likes.service";
import { LikeArticleDto } from "./dto";
import { IRequest } from "src";
import { AccessTokenGuard } from "src/auth/guard";

@Controller("likes")
export class LikesController {
    constructor(private serv: LikesService) {}

    @Post("")
    @HttpCode(HttpStatus.OK)
    @UseGuards(AccessTokenGuard)
    async likeArticle(@Req() req: IRequest, @Body() dto: LikeArticleDto) {
        await this.serv.likeArticle(dto.articleId, req.user._id);
        return { message: "Article liked/disliked" };
    }

    @Get("")
    @UseGuards(AccessTokenGuard)
    async getLikedArticles(@Req() req: IRequest) {
        const articles = await this.serv.getLikedArticles(req.user._id);
        return { articles, message: "Liked articles" };
    }
}
