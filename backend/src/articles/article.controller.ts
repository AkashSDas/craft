import {
    BadRequestException,
    Body,
    Controller,
    ForbiddenException,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
    Req,
    UseGuards,
    forwardRef,
} from "@nestjs/common";
import { ArticleService } from "./article.service";
import { AccessTokenGuard } from "../auth/guard";
import { IRequest } from "../index";
import { UpdateArticleContentDto } from "./dto";
import { LikesService } from "src/likes/likes.service";
import { Request } from "express";
import { UserService } from "src/users/user.service";

@Controller("articles")
export class ArticleController {
    constructor(
        private serv: ArticleService,
        private likesService: LikesService,
        @Inject(forwardRef(() => UserService)) private userService: UserService,
    ) {}

    @Get("trending")
    @HttpCode(HttpStatus.OK)
    async getTrendingArticles(
        @Query("limit", {
            transform: (value) => {
                const limit = parseInt(value);
                if (isNaN(limit)) return 5;

                if (limit < 0) {
                    throw new BadRequestException("Invalid limit");
                } else if (limit > 10) {
                    throw new BadRequestException(
                        "Limit cannot be greater than 10",
                    );
                }

                return limit;
            },
        })
        limit: number,
    ) {
        const articles = await this.serv.getTrendingArticles(limit);
        return { articles };
    }

    // =========================================
    // Article editor
    // =========================================

    @Post("")
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AccessTokenGuard)
    async createNewArticle(@Req() req: IRequest) {
        const article = await this.serv.createNewArticle(req.user._id);
        return { article, message: "Article created successfully" };
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

    @Put(":articleId/publish")
    @HttpCode(HttpStatus.OK)
    @UseGuards(AccessTokenGuard)
    async publishArticle(@Req() req: IRequest) {
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
        await this.serv.publishArticle(article);
        return { message: "Updated successfully" };
    }

    // =========================================
    // User articles
    // =========================================

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

        const likeCount = {};
        likes.forEach((v, k) => {
            likeCount[k] = v;
        });

        return { articles, likeCount };
    }

    @Get("authors/:authorId/articles")
    @HttpCode(HttpStatus.OK)
    async getAuthorArticles(
        @Req() req: IRequest,
        @Param("authorId") authorId: string,
    ) {
        const author = await this.userService.checkUserExists(authorId);
        if (!author) {
            throw new NotFoundException("Author not found");
        }

        const articles = await this.serv.getUserArticles(author._id, "public");

        const likes = await this.likesService.getArticlesLikes(
            articles.map((a) => a._id),
        );

        const likeCount = {};
        likes.forEach((v, k) => {
            likeCount[k] = v;
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

    // =========================================
    // Search articles and trending articles
    // =========================================

    @Get("")
    @HttpCode(HttpStatus.OK)
    async getArticlesPaginated(
        @Query("limit", {
            transform(value, metadata) {
                const limit = parseInt(value);
                if (isNaN(limit) || limit < 0) {
                    throw new BadRequestException("Invalid limit");
                }
                return limit;
            },
        })
        limit: number,
        @Query("offset", {
            transform(value, metadata) {
                const offset = parseInt(value);
                if (isNaN(offset) || offset < 0) {
                    throw new BadRequestException("Invalid offset");
                }
                return offset;
            },
        })
        offset: number,
        @Query("query") query?: string,
    ) {
        const { articles, totalCount } = await this.serv.getArticlesPaginated(
            limit,
            offset,
            query,
        );
        const likes = await this.likesService.getArticlesLikes(
            articles.map((a) => a._id),
        );

        const likeCount: Record<string, number> = {};
        likes.forEach((v, k) => {
            likeCount[k] = v;
        });

        return { articles, likeCount, totalCount, nextOffset: offset + limit };
    }
}
