import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    UseGuards,
} from "@nestjs/common";
import { CommentService } from "./comments.service";
import { AccessTokenGuard } from "src/auth/guard";
import { IRequest } from "src";
import { AddCommentDto } from "./dto";
import { ArticleService } from "src/articles/article.service";

@Controller("comments")
export class CommentController {
    constructor(
        private serv: CommentService,
        private articleServ: ArticleService,
    ) {}

    @Post("")
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AccessTokenGuard)
    async addComment(@Req() req: IRequest, @Body() dto: AddCommentDto) {
        const exists = await this.articleServ.exists(dto.articleId);
        if (!exists) {
            throw new BadRequestException("Article not found");
        }

        const comment = await this.serv.addComment(
            dto.text,
            req.user._id,
            exists._id,
        );

        return { comment, message: "Comment added" };
    }
}
