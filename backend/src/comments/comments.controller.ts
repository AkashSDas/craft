import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Query,
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

    @Get("")
    async getCommentsForArticle(@Query("articleId") articleId: string) {
        if (!articleId) {
            throw new BadRequestException("Article ID is required");
        }

        const exists = await this.articleServ.exists(articleId);
        if (!exists) {
            throw new BadRequestException("Article not found");
        }

        const comments = await this.serv.getComments(exists._id);
        return { comments, message: "Comments retrieved" };
    }

    @Post(":commentId/report")
    @HttpCode(HttpStatus.OK)
    @UseGuards(AccessTokenGuard)
    async reportComment(
        @Req() req: IRequest,
        @Param("commentId") commentId: string,
    ) {
        if (!commentId) {
            throw new BadRequestException("Comment ID is required");
        }
        await this.serv.reportComment(commentId, req.user._id);
        return { message: "Comment reported" };
    }

    @Delete(":commentId")
    @HttpCode(HttpStatus.OK)
    @UseGuards(AccessTokenGuard)
    async deleteComment(@Param("commentId") commentId: string) {
        if (!commentId) {
            throw new BadRequestException("Comment ID is required");
        }

        await this.serv.deleteComment(commentId);
        return { message: "Comment deleted" };
    }
}
