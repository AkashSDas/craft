import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { LikesService } from "./likes.service";
import { LikeArticleDto } from "./dto";
import { IRequest } from "src";
import { AccessTokenGuard } from "src/auth/guard";

@Controller("likes")
export class LikesController {
    constructor(private serv: LikesService) {}

    @Post("")
    @UseGuards(AccessTokenGuard)
    async likeArticle(@Req() req: IRequest, @Body() dto: LikeArticleDto) {
        await this.serv.likeArticle(dto.articleId, req.user._id);
        return { message: "Article liked/disliked" };
    }
}
