import {
    Controller,
    ForbiddenException,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Post,
    Put,
    Req,
    UseGuards,
} from "@nestjs/common";
import { ArticleService } from "./article.service";
import { AccessTokenGuard } from "../auth/guard";
import { IRequest } from "../index";
import { UpdateArticleContentDto } from "./dto";

@Controller("articles")
export class ArticleController {
    constructor(private serv: ArticleService) {}

    @Post("")
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AccessTokenGuard)
    async createNewArticle(@Req() req: IRequest) {
        const article = await this.serv.createNewArticle(req.user._id);
        return { article, message: "Article created successfully" };
    }

    @Get(":articleId")
    @HttpCode(HttpStatus.OK)
    async getArticle(@Req() req: IRequest) {
        const article = await this.serv.getArticle(req.params.articleId);
        if (!article) {
            throw new NotFoundException("Article not found");
        }
        return { article };
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
        body: UpdateArticleContentDto,
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
        this.serv.updateNonFileContent(article, body);

        return { message: body };
    }
}
