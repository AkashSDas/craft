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
    UseGuards,
} from "@nestjs/common";
import { ReadingListsService } from "./readling-lists.service";
import { AccessTokenGuard } from "src/auth/guard";
import { IRequest } from "src";
import {
    AddOrRemoveArticleToReadingListsDto,
    CreateReadingListDto,
} from "./dto";

@Controller("reading-lists")
export class ReadingListsController {
    constructor(private serv: ReadingListsService) {}

    /**
     * Update reading lists (add/remove) in which the article is saved
     */
    @Put("")
    @HttpCode(HttpStatus.OK)
    @UseGuards(AccessTokenGuard)
    async addOrRemoveArticleFromReadingLists(
        @Req() req: IRequest,
        @Body() dto: AddOrRemoveArticleToReadingListsDto,
    ) {
        await this.serv.addOrRemoveFromReadingLists(req.user._id, dto);
        return { message: "Article updated in the reading lists." };
    }

    @Post("")
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AccessTokenGuard)
    async createReadingList(
        @Req() req: IRequest,
        @Body() dto: CreateReadingListDto,
    ) {
        const readingList = await this.serv.createReadingList(
            req.user._id,
            dto,
        );
        return { message: "Reading list created", readingList };
    }

    @Get("")
    @HttpCode(HttpStatus.OK)
    @UseGuards(AccessTokenGuard)
    async getReadingLists(@Req() req: IRequest) {
        const readingLists = await this.serv.getReadingLists(req.user._id);
        return { readingLists, message: "Reading lists" };
    }

    @Get(":readingListId")
    @HttpCode(HttpStatus.OK)
    async getReadingList(
        @Query("userId") userId: string,
        @Param("readingListId") readingListId: string,
    ) {
        const { list, articles, likes } = await this.serv.getReadingList(
            userId,
            readingListId,
        );
        return { readingList: list, articles, likes, message: "Reading list" };
    }
}
