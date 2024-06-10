import {
    Body,
    Controller,
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
}
