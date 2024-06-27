import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    Req,
    Res,
    UseGuards,
} from "@nestjs/common";
import { ViewsService } from "./views.service";
import { AccessTokenGuard } from "src/auth/guard";
import { IRequest } from "src";
import { AddViewDto, UpdateReadTimeDto } from "./dto";
import { ArticleService } from "src/articles/article.service";
import { Response } from "express";
import { LifetimeViewsQuery, MonthlyViewsQuery } from "./query";

@Controller("views")
export class ViewsController {
    constructor(
        private serv: ViewsService,
        private articleServ: ArticleService,
    ) {}

    /**
     * Views are only counted when article is viewed by logged in user.
     */
    @Post("")
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(AccessTokenGuard)
    async addViewForArticle(
        @Req() req: IRequest,
        @Body() dto: AddViewDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const exists = await this.articleServ.exists(dto.articleId);
        if (exists) {
            try {
                const view = await this.serv.addViewForArticle(
                    req.user._id,
                    exists._id,
                );

                res.cookie("viewId", view._id, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    maxAge: 1000 * 60 * 60 * 3, // 3h
                });
            } catch (e) {}
        }
    }

    @Put()
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(AccessTokenGuard)
    async updateReadTimeForArticle(
        @Req() req: IRequest,
        @Body() dto: UpdateReadTimeDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { viewId } = req.cookies;
        const exists = await this.articleServ.exists(dto.articleId);
        if (exists && viewId && dto.readTimeInMs >= 0) {
            try {
                await this.serv.updateReadTimeForArticle(
                    viewId,
                    dto.readTimeInMs,
                    req.user._id,
                    exists._id,
                );

                res.clearCookie("viewId", {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    maxAge: 1000 * 60 * 60 * 3, // 3h
                });
            } catch (e) {}
        }
    }

    @Get("monthly-views")
    @HttpCode(HttpStatus.OK)
    @UseGuards(AccessTokenGuard)
    async getUserArticlesMonthlyViewsAggregated(
        @Req() req: IRequest,
        @Query() query: MonthlyViewsQuery,
    ) {
        const views = await this.serv.getUserArticlesMonthlyViewsAggregated(
            req.user._id,

            // Validators only check the values but since they're query they will
            // come in as string
            Number(query.startTimestampInMs),
            Number(query.endTimestampInMs),
        );

        return { views };
    }

    @Get("lifetime-views")
    @HttpCode(HttpStatus.OK)
    @UseGuards(AccessTokenGuard)
    async getUserArticlesLifetimeViewsAggregated(
        @Req() req: IRequest,
        @Query() query: LifetimeViewsQuery,
    ) {
        const views = await this.serv.getUserArticlesLifetimeViewsAggregated(
            req.user._id,
            query,
        );

        return { views };
    }
}
