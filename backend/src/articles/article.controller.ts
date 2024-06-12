import {
    Body,
    Controller,
    ForbiddenException,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Post,
    Put,
    Query,
    Req,
    UseGuards,
} from "@nestjs/common";
import { ArticleService } from "./article.service";
import { AccessTokenGuard } from "../auth/guard";
import { IRequest } from "../index";
import { UpdateArticleContentDto } from "./dto";
import { LikesService } from "src/likes/likes.service";
import { Request } from "express";

@Controller("articles")
export class ArticleController {
    constructor(
        private serv: ArticleService,
        private likesService: LikesService,
    ) {}

    @Post("")
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AccessTokenGuard)
    async createNewArticle(@Req() req: IRequest) {
        const article = await this.serv.createNewArticle(req.user._id);
        return { article, message: "Article created successfully" };
    }

    @Get("me")
    @HttpCode(HttpStatus.OK)
    @UseGuards(AccessTokenGuard)
    async getUserArticles(
        @Req() req: IRequest,
        @Query("type") type: "draft" | "public",
    ) {
        const articles = await this.serv.getUserArticles(req.user._id, type);
        const likes = await this.likesService.getArticlesLikes(
            articles.map((a) => a._id),
        );

        const likeCount = new Map();
        likes.forEach((v, k) => {
            likeCount.set(k, v);
        });

        return { articles, likeCount };
    }

    @Get(":articleId")
    @HttpCode(HttpStatus.OK)
    async getArticle(@Req() req: Request) {
        const article = await this.serv.getArticle(req.params.articleId);
        if (!article) {
            throw new NotFoundException("Article not found");
        }

        const likes = await this.likesService.getArticlesLikes([article._id]);
        const likeCount = likes.get(article._id.toString()) ?? 0;
        return { article, likeCount };
    }

    /**
     * This is responsible for saving the non-file content of an article.
     * For example paragraphs, headings, and dividers.
     */
    @Put(":articleId/content")
    @HttpCode(HttpStatus.OK)
    @UseGuards(AccessTokenGuard)
    async updateArticleContent(
        @Req() req: IRequest,
        @Body() body: UpdateArticleContentDto,
    ) {
        const exists = await this.serv.checkOwnership(
            req.user._id,
            req.params.articleId,
        );
        if (!exists) {
            throw new ForbiddenException(
                "You don't have permission to edit this article",
            );
        }

        const article = await this.serv.getArticle(req.params.articleId);
        await this.serv.updateNonFileContent(article, body);
        await this.serv.updateArticleInfoUsingBlocks(req.params.articleId);
        return { message: "Updated successfully" };
    }

    @Put(":articleId/reorder-blocks")
    @HttpCode(HttpStatus.OK)
    @UseGuards(AccessTokenGuard)
    async reorderBlocks(@Req() req: IRequest) {
        const exists = await this.serv.checkOwnership(
            req.user._id,
            req.params.articleId,
        );
        if (!exists) {
            throw new ForbiddenException(
                "You don't have permission to edit this article",
            );
        }

        const article = await this.serv.getArticle(req.params.articleId);
        await this.serv.reorderBlocks(article, req.body.blockIds);
        return { message: "Updated successfully" };
    }

    @Put(":articleId/files")
    @HttpCode(HttpStatus.OK)
    @UseGuards(AccessTokenGuard)
    async updateArticleFiles(@Req() req: IRequest) {
        const exists = await this.serv.checkOwnership(
            req.user._id,
            req.params.articleId,
        );
        if (!exists) {
            throw new ForbiddenException(
                "You don't have permission to edit this article",
            );
        }

        if (
            typeof req.files === "object" &&
            req.files !== null &&
            Object.keys(req.files).length > 0
        ) {
            const article = await this.serv.getArticle(req.params.articleId);
            await this.serv.updateFiles(article, req.files as any);
            await this.serv.updateArticleInfoUsingBlocks(req.params.articleId);
        }

        return { message: "Updated successfully" };
    }
}
