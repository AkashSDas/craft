import { Controller } from "@nestjs/common";
import { ReadingListsService } from "./readling-lists.service";

@Controller("reading-lists")
export class ReadingListsController {
    constructor(private serv: ReadingListsService) {}
}
