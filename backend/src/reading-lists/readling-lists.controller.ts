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
import { ReadingListsService } from "./readling-lists.service";
import { AccessTokenGuard } from "src/auth/guard";
import { IRequest } from "src";
import { CreateReadingListDto } from "./dto";

@Controller("reading-lists")
export class ReadingListsController {
    constructor(private serv: ReadingListsService) {}

    @Post("")
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AccessTokenGuard)
    async createReadingList(
        @Req() req: IRequest,
        @Body() dto: CreateReadingListDto,
    ) {
        await this.serv.createReadingList(req.user._id, dto);
        return { message: "Reading list created" };
    }

    @Get("")
    @HttpCode(HttpStatus.OK)
    @UseGuards(AccessTokenGuard)
    async getReadingLists(@Req() req: IRequest) {
        const readingLists = await this.serv.getReadingLists(req.user._id);
        return { readingLists, message: "Reading lists" };
    }
}
