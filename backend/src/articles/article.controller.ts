import {
    Controller,
    ForbiddenException,
    HttpCode,
    HttpStatus,
    Post,
    Put,
    Req,
    UseGuards,
} from "@nestjs/common";
import { ArticleService } from "./article.service";
import { AccessTokenGuard } from "../auth/guard";
import { IRequest } from "../index";

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

    @Put(":articleId/content")
    @HttpCode(HttpStatus.OK)
    @UseGuards(AccessTokenGuard)
    async updateArticleContent(@Req() req: IRequest) {
        const exists = await this.serv.checkOwnership(
            req.user._id,
            req.params.articleId,
        );
        if (!exists) {
            throw new ForbiddenException(
                "You don't have permission to edit this article",
            );
        }

        return { message: "hi" };
    }
}
